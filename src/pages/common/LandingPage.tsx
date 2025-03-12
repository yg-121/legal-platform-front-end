// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// const LandingPage: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
//       <h1 className="text-4xl font-bold text-blue-800 mb-6">Welcome to Legal Platform</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
//         {/* Client Section */}
//         <Card className="shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-xl text-blue-600">For Clients</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <p className="text-gray-600">Find top lawyers, post your case, and get legal help fast.</p>
//             <Button
//               className="w-full bg-blue-600 hover:bg-blue-700"
//               onClick={() => navigate('/auth')}
//             >
//               Get Started
//             </Button>
//           </CardContent>
//         </Card>
//         {/* Lawyer Section */}
//         <Card className="shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-xl text-blue-600">For Lawyers</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <p className="text-gray-600">Connect with clients, manage cases, and grow your practice.</p>
//             <Button
//               className="w-full bg-blue-600 hover:bg-blue-700"
//               onClick={() => navigate('/auth')}
//             >
//               Join Now
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;