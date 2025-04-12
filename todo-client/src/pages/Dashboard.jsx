// Dans Dashboard.jsx

import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  User,
  Settings,
  LogOut,
  BarChart2,
  ListChecks, // Icône plus appropriée pour les tâches
} from "lucide-react"; 

import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

export default function Dashboard() {
  const [view, setView] = useState("dashboard"); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Ajouter un état pour forcer le rafraîchissement de TaskList
  const [taskListKey, setTaskListKey] = useState(0); 

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fonction à passer à TaskForm pour déclencher le rafraîchissement
  const handleTaskAdded = () => {
    // Changer la clé force le re-rendu de TaskList
    setTaskListKey(prevKey => prevKey + 1); 
  };

  // Fonction pour gérer la déconnexion (exemple)
  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimer le token
    // Rediriger vers la page de connexion (nécessite useNavigate de react-router-dom)
    // import { useNavigate } from 'react-router-dom';
    // const navigate = useNavigate();
    // navigate('/login'); 
    window.location.href = '/login'; // Alternative simple mais recharge la page
  };


  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-white border-r z-40 transform transition-transform duration-200 ease-in-out shadow-md`} // Ajout ombre
      >
        <div className="flex items-center justify-between md:justify-center px-4 py-4 border-b">
          <span className="text-xl font-bold text-indigo-600">MyDashboard</span>
          <button className="md:hidden text-gray-600" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <NavItem icon={<Home size={20} />} label="Accueil" onClick={() => setView("dashboard")} active={view === 'dashboard'} />
          {/* Utiliser une icône plus pertinente et gérer l'état actif */}
          <NavItem icon={<ListChecks size={20} />} label="Gestion Tâches" onClick={() => setView("tasks")} active={view === 'tasks'} /> 
          <NavItem icon={<User size={20} />} label="Profil" onClick={() => alert('Profil - Non implémenté')} />
          <NavItem icon={<Settings size={20} />} label="Paramètres" onClick={() => alert('Paramètres - Non implémenté')} />
          {/* Ajouter la logique de déconnexion */}
          <NavItem icon={<LogOut size={20} />} label="Déconnexion" onClick={handleLogout} /> 

        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between md:justify-end sticky top-0 z-30"> {/* Ombre légère et sticky */}
          <button className="md:hidden text-gray-600" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <div className="hidden md:block">
            {/* Vous pourriez récupérer le nom de l'utilisateur ici */}
            <span className="font-medium text-gray-700">Bienvenue 👋</span> 
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto"> {/* Permettre le défilement si contenu long */}
          {view === "dashboard" && (
            <>
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tableau de bord</h1> {/* Marge augmentée */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Espace augmenté */}
                {/* Ces cartes sont des exemples, adaptez-les à vos données réelles */}
                <DashboardCard title="Tâches Actives" value="N/A" /> 
                <DashboardCard title="Tâches Terminées" value="N/A" />
                <DashboardCard title="Statistique 3" value="N/A" />
              </div>
            </>
          )}

          {view === "tasks" && (
            <div> {/* Enlever p-6 redondant */}
              <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestion des tâches</h1>
              {/* Passer la fonction handleTaskAdded en prop */}
              <TaskForm onTaskAdded={handleTaskAdded} /> 
              {/* Ajouter la clé taskListKey à TaskList */}
              <TaskList key={taskListKey} /> 
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

// Amélioration NavItem pour montrer l'élément actif
function NavItem({ icon, label, onClick, active }) { 
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-2.5 text-sm rounded-lg transition ${ // py augmenté, text-sm
        active 
          ? 'bg-indigo-100 text-indigo-700 font-medium' // Style actif
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' // Style normal
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </button>
  );
}


function DashboardCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg p-5 shadow hover:shadow-lg transition-shadow duration-300"> {/* Padding et ombre ajustés */}
      <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h2> {/* Style titre */}
      <p className="text-3xl font-semibold text-gray-900 mt-2">{value}</p> {/* Style valeur */}
    </div>
  );
}
