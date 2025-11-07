import React from "react";
import TopBar from "./TopBar";
import Cardviews from "./Cardviews";
import Reliefduties from "./Reliefduties";
import Announcements from "./Announcements";
import TeachNavigationBar from "./TeachNavigationbar";
export default function Dashboard() {
return (

// navigation bar include here
      <div className="flex h-screen bg-gray-100">
        <TeachNavigationBar/>

    <div className="flex-1 flex flex-col">
      <TopBar/>
    


    <main className="flex-1 p-4 space-y-6"> 
     
      {/*greating*/}
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-2xl font-semibold">Welcome back, Sama Perera!</h2>
          <p className="text-sm opacity-90">Here's your overview for today.</p>
        </div>

        {/*card views include here*/}
        <div className="flex -1 flex flex-col">
          <Cardviews/>
        </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/*relied duties inclide here*/}
          <Reliefduties/>  

        {/*announcement include here*/}
        <Announcements/>
        </div>



        
    </main>

</div>
</div>


)

}