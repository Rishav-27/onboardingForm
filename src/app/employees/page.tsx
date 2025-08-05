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

// Helper function to convert snake_case to camelCase
function toCamelCase<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => toCamelCase(item)) as T;
    }
    const newObj = {} as T;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const camelCaseKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
            newObj[camelCaseKey as keyof T] = toCamelCase(obj[key]);
        }
    }
    return newObj;
}

export default function EmployeesPage() {
    const router = useRouter();
    const [employees, setEmployees] = useState<OnboardingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Get the new actions from the store
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
            const data = await response.json();
            const camelCaseData: OnboardingData[] = toCamelCase(data);
            setEmployees(camelCaseData);
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
            toast.success("Employee deleted successfully!");
            await fetchEmployees();
        } catch (e) {
            console.error("Error deleting employee:", e);
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while deleting the employee.";
            toast.error(`Error deleting employee: ${errorMessage}`);
        }
    };

    const handleEditEmployee = (employee: OnboardingData) => {
        // Correct edit flow:
        // 1. Load the employee's data into the store
        setOnboardingData(employee);
        // 2. Set the isEditingMode flag to true
        setEditingMode(true);
        // 3. Navigate to the onboarding form
        router.push('/onboarding');
    };
    
    const handleAddEmployee = () => {
        // Correct new employee flow:
        // 1. Reset the store to its initial state
        resetOnboarding();
        // 2. Set the isEditingMode flag to false (already the default, but good practice)
        setEditingMode(false);
        // 3. Navigate to the onboarding form
        router.push('/onboarding');
    };

    // No changes to loading/error states...
    if (loading) { /* ... */ }
    if (error) { /* ... */ }

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
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => employee.employeeId && handleDeleteEmployee(employee.employeeId)}
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