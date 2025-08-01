// "use client";

// import { useEffect, useState } from "react";
// import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
// import { OnboardingData } from "@/features/onboarding/useOnboardingStore";

// export default function EmployeesPage (){
//     const[employees, setEmployees] = useState<OnboardingData[]>([]);
//     const [loading,setLoading]= useState(true);

//     useEffect(()=>{
//         if (typeof window !== 'undefined'){
//             const storedEmployees = localStorage.getItem('employees');
//             try{
//                 const parsedEmployees: OnboardingData[] = storedEmployees? JSON.parse(storedEmployees): [];
//                 setEmployees(parsedEmployees);
//             }catch (e){
//                 console.error("Failed to load employees from localStorage:",e);
//                 setEmployees([]);
//             }finally{
//                 setLoading(false);
//             }
//         }else{
//             setLoading(false);
//         }
//     },[]);

//     if (loading){
//         return(
//             <div className="container mx-auto p-8 text-center text-gray-600">
//                 Loading employee data...
//             </div>
//         );
//     }

//     return(
//         <div className="container mx-auto p-8">
//             <h1 className="text-3xl font-bold mb-6 text-center">Onboarded Employees</h1>

//             {employees.length === 0 ? (
//                 <p className="text-center text-gray-500">
//                     No employees onboarded yet. Please use the onboarding form to add new employees.
//                 </p>
//             ):(
//                 <div className="border rounded-lg overflow-hidden shadow-sm">
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Full Name</TableHead>
//                                 <TableHead>Email</TableHead>
//                                 <TableHead>Phone Number</TableHead>
//                                 <TableHead>Department</TableHead>
//                                 <TableHead>Role</TableHead>
//                                 <TableHead>Date of Joining </TableHead>
//                                 <TableHead>Employee ID</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {employees.map((employee: OnboardingData, index: number) =>(
//                                 <TableRow key={index}>
//                                     <TableCell className="font-medium">{employee.fullName}</TableCell>
//                                     <TableCell>{employee.email}</TableCell>
//                                     <TableCell>{employee.phoneNumber}</TableCell>
//                                     <TableCell>{employee.department}</TableCell>
//                                     <TableCell>{employee.role}</TableCell>
//                                     <TableCell>{employee.dateOfJoining}</TableCell>
//                                     <TableCell>{employee.employeeId}</TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </div>
//             )}
//         </div>
//     );
// }