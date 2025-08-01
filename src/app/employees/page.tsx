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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import toast from "react-hot-toast";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<OnboardingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<OnboardingData | null>(null);

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
      toast.success("Employee deleted successfully!");
      await fetchEmployees();
    } catch (e) {
      console.error("Error deleting employee:", e);
      const errorMessage =
        e instanceof Error
          ? e.message
          : "An unknown error occurred while deleting the employee.";
      toast.error(`Error deleting employee: ${errorMessage}`);
    }
  };

  const handleEditEmployee = (employee: OnboardingData)=>{
    setEditingEmployee({ ...employee});
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    if (editingEmployee){
      setEditingEmployee({
        ...editingEmployee,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSelectChange = (name: string, value: string)=>{
    if (editingEmployee){
      setEditingEmployee({
        ...editingEmployee,
        [name]: value,
      });
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent)=>{
    e.preventDefault();
    if (!editingEmployee)
      return;

    try{
      const response = await fetch ('/api/employees',{
        method: 'PUT',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(editingEmployee),
      });

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update employee.');
      }

      toast.success("Employee updated successfully!");
      setEditingEmployee(null);
      await fetchEmployees();
    }catch (e){
      console.error("Error updating employee:",e);
      const errorMessage = e instanceof Error ? e.message: 'An unknown error occurred while updating the employee.';
      toast.error(`Error: ${errorMessage}`);
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

  if(editingEmployee){
    return(
      <div className="container mx-auto p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Employee: {editingEmployee.fullName}</CardTitle>
          </CardHeader>
          <form onSubmit={handleUpdateSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="fullName">Full Name</label>
                  <Input
                    id="FullName"
                    name="fullName"
                    value={editingEmployee.fullName}
                    onChange={handleUpdateChange}
                    />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={editingEmployee.email}
                    onChange={handleUpdateChange}
                    />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={editingEmployee.phoneNumber}
                    onChange={handleUpdateChange}
                    />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    name="employeeId"
                    value={editingEmployee.employeeId}
                    disabled
                    />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={editingEmployee.department}
                    onValueChange={(val) => handleSelectChange('department',val)}
                    >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select a department"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    name="role"
                    value={editingEmployee.role}
                    onChange={handleUpdateChange}
                    />
                </div>
              </div>
              <div>
                <Label htmlFor="dateOfJoining">Date of Joining</Label>
                <Input
                  id="dateOfJoining"
                  name="dateOfJoining"
                  type="date"
                  value={editingEmployee.dateOfJoining}
                  onChange={handleUpdateChange}
                  />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelEdit} type='button'>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Onboarded Employees
      </h1>
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
                      onClick={() => handleEditEmployee(employee)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEmployee(employee.employeeId!)}
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