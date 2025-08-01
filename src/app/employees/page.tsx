"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OnboardingData } from "@/features/onboarding/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<OnboardingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/employees");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch employees.");
      }

      const data: OnboardingData[] = await response.json();
      setEmployees(data);
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Error fetching employees:", err);
      setError(err.message || "Failed to load employee data.");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleRestoreData = async () => {
    if (
      !confirm(
        "Are you sure you want to restore initial employee data? This will overwrite current data."
      )
    ) {
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/restore-employees", {
        method: "POST",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to restore data.");
      }
      alert("Employee data restored successfully!");
      await fetchEmployees();
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to restore employee data.";
      console.error("Error restoring employees:", e);
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (
      !confirm(
        `Are you sure you want to delete employee with ID: ${employeeId}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/employees?id=${employeeId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete employee.");
      }
      alert("Employee deleted successfully!");
      await fetchEmployees();
    } catch (e) {
      console.error("Error deleting employee:", e);
      const errorMessage =
        e instanceof Error
          ? e.message
          : "An unknown error occurred while deleting the employee.";
      alert(`Error deleting employee: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center text-gray-600">
        Loading employee data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-600">
        <p>Error: {error}</p>
        <p>Please check the server logs for more details.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Onboarded Employees
      </h1>
      <div className="flex justify-end mb-4">
        <Button onClick={handleRestoreData} variant="outline">
          Restore Initial Data
        </Button>
      </div>

      {employees.length === 0 ? (
        <p className="text-center text-gray-500">
          No employees onboarded yet. Please use the onboarding form to add new
          employees.
        </p>
      ) : (
        <div className="border rounded-lg overflow-auto shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">S.No.</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date Joined</TableHead>

                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee: OnboardingData, index: number) => (
                <TableRow key={employee.employeeId || index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{employee.employeeId || "-"}</TableCell>
                  <TableCell className="font-medium">
                    {employee.fullName}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phoneNumber || "-"}</TableCell>
                  <TableCell>{employee.department || "-"}</TableCell>
                  <TableCell>{employee.role || "-"}</TableCell>
                  <TableCell>{employee.dateOfJoining || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2"
                      // onClick={() => handleEditEmployee(employee.employeeId)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEmployee(employee.employeeId!)} // Use ! to assert non-null
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
