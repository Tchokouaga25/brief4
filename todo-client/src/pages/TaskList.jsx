// Dans TaskList.jsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axios"; // Import the configured Axios instance
import TaskItem from "./TaskItem"; // Import the TaskItem component
import { Loader2, Search } from 'lucide-react'; // Importer l'icône Search

// ... FilterButton reste inchangé ...
function FilterButton({ label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded-md transition ${
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );
}


export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  // Nouvel état pour le terme de recherche
  const [searchTerm, setSearchTerm] = useState('');

  // --- Fonctions fetchTasks, handleToggle, handleDelete (restent inchangées) ---
  const fetchTasks = useCallback(async () => {
    // ... (code fetchTasks) ...
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/tasks");
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err.response || err);
      setError(err.response?.data?.message || "Impossible de charger les tâches pour le moment.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggle = useCallback(async (taskId) => {
    // ... (code handleToggle) ...
    const originalTasks = [...tasks];
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    setError(null);

    try {
      // !! Adapter l'appel API si nécessaire (PATCH est souvent mieux que /toggle)
      await api.patch(`/tasks/${taskId}`, { completed: !originalTasks.find(t => t.id === taskId)?.completed });
    } catch (err) {
      console.error("Error updating task:", err.response || err);
      setError(err.response?.data?.message || "Impossible de mettre à jour la tâche.");
      setTasks(originalTasks);
    }
  }, [tasks]);

  const handleDelete = useCallback(async (taskId) => {
    // ... (code handleDelete) ...
     const originalTasks = [...tasks];
     setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
     setError(null);

    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (err) {
      console.error("Error deleting task:", err.response || err);
      setError(err.response?.data?.message || "Impossible de supprimer la tâche.");
       setTasks(originalTasks);
    }
  }, [tasks]);

  // --- Filtrer les tâches pour l'affichage (avec recherche) ---
  const filteredTasks = tasks.filter(task => {
    // 1. Filtrer par statut (comme avant)
    let statusMatch = true;
    if (filter === 'active') {
      statusMatch = !task.completed;
    } else if (filter === 'completed') {
      statusMatch = task.completed;
    }

    // 2. Filtrer par terme de recherche (si un terme est saisi)
    let searchMatch = true;
    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      // Vérifier si le titre OU la description contient le terme (insensible à la casse)
      searchMatch = (task.title && task.title.toLowerCase().includes(lowerSearchTerm)) ||
                    (task.description && task.description.toLowerCase().includes(lowerSearchTerm));
    }

    // La tâche est gardée si elle correspond aux DEUX filtres (statut ET recherche)
    return statusMatch && searchMatch;
  });

  // --- Rendu du composant ---
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow space-y-4">
      {/* Section Recherche et Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 pb-4 border-b border-gray-200 border-solid">
        {/* Barre de recherche */}
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Rechercher une tâche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 border-solid rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={18} />
          </div>
        </div>
        {/* Boutons de filtre */}
        <div className="flex justify-center sm:justify-end flex-wrap gap-2">
          <FilterButton label="Toutes" onClick={() => setFilter('all')} active={filter === 'all'} />
          <FilterButton label="Actives" onClick={() => setFilter('active')} active={filter === 'active'} />
          <FilterButton label="Terminées" onClick={() => setFilter('completed')} active={filter === 'completed'} />
        </div>
      </div>


      {/* Affichage conditionnel : Chargement, Erreur, ou Liste */}
      {isLoading && ( /* ... code chargement ... */
         <div className="flex justify-center items-center py-6 text-gray-500">
           <Loader2 className="animate-spin mr-2" size={20} />
           <span>Chargement des tâches...</span>
         </div>
      )}
      {error && ( /* ... code erreur ... */
        <p className="text-center text-red-600 bg-red-100 p-3 rounded-md border border-red-200">{error}</p>
      )}

      {!isLoading && !error && (
        <div className="space-y-3 min-h-[100px]">
          {/* Message si aucune tâche ne correspond aux filtres/recherche */}
          {filteredTasks.length === 0 ? (
             <p className="text-center text-gray-500 py-6 italic">
               {searchTerm.trim() !== ''
                 ? 'Aucune tâche ne correspond à votre recherche.'
                 : filter === 'all' ? 'Aucune tâche pour le moment.'
                 : filter === 'active' ? 'Aucune tâche active.'
                 : 'Aucune tâche terminée.'}
             </p>
          ) : (
            // Mapper sur les tâches filtrées
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => handleToggle(task.id)}
                onDelete={() => handleDelete(task.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
