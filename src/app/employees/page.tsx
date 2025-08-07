'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useOnboardingStore, OnboardingData } from "@/features/onboarding/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus, User } from "lucide-react";
import toast from "react-hot-toast";


export default function EmployeesPage() {
    const router = useRouter();
    const [employees, setEmployees] = useState<OnboardingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { setOnboardingData, resetOnboarding, setEditingMode } = useOnboardingStore();

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
            // Assuming your API returns data in the correct format (e.g., employee_id)
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
        if (!confirm(`Are you sure you want to delete employee with ID: ${employeeId}?`)) {
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
            toast.success("Employee deleted successfully!", { position: 'bottom-right' });
            await fetchEmployees();
        } catch (e) {
            console.error("Error deleting employee:", e);
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while deleting the employee.";
            toast.error(`Error deleting employee: ${errorMessage}`, { position: 'bottom-right' });
        }
    };

    const handleEditEmployee = (employee: OnboardingData) => {
        setOnboardingData(employee);
        setEditingMode(true);
        router.push('/onboarding');
    };

    const handleAddEmployee = () => {
        resetOnboarding();
        setEditingMode(false);
        router.push('/onboarding');
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-xl">Loading employees...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-xl text-red-600">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <User className="w-8 h-8" />
                    Onboarded Employees
                </h1>
                <Button onClick={handleAddEmployee} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Employee
                </Button>
            </div>
            {employees.length === 0 ? (
                <p className="text-center text-gray-500">
                    No employees onboarded yet. Please use the onboarding form to add new employees.
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
                            {employees.map((employee, index) => (
                                <TableRow key={employee.employee_id || index}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{employee.employee_id || "-"}</TableCell>
                                    <TableCell className="font-medium">
                                        {employee.full_name}
                                    </TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee.phone_number || "-"}</TableCell>
                                    <TableCell>{employee.department || "-"}</TableCell>
                                    <TableCell>{employee.role || "-"}</TableCell>
                                    <TableCell>{employee.date_of_joining || "-"}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mr-2"
                                            onClick={() => handleEditEmployee(employee)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => employee.employee_id && handleDeleteEmployee(employee.employee_id)}
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