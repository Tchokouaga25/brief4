// Dans TaskList.jsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axios"; // Import the configured Axios instance
import TaskItem from "./TaskItem"; // Import the TaskItem component
import { Loader2 } from 'lucide-react'; // Optional: for a loading spinner

// FilterButton component (can stay here or move to its own file)
function FilterButton({ label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded-md transition ${
        active
          ? 'bg-blue-600 text-white shadow-sm' // Added shadow for active state
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

export default function TaskList() {
  const [tasks, setTasks] = useState([]); // State for the list of tasks
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const [error, setError] = useState(null); // State for API errors
  const [filter, setFilter] = useState('all'); // Current filter ('all', 'active', 'completed')

  // --- Function to fetch tasks ---
  const fetchTasks = useCallback(async () => {
    setIsLoading(true); // Start loading
    setError(null); // Reset errors
    try {
      // API call to get tasks (adjust endpoint if needed, e.g., '/api/tasks')
      const response = await api.get("/tasks");
      // Update state with received tasks (ensure response.data is an array)
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err.response || err); // Log the detailed error
      // Set an error message for the user
      setError(err.response?.data?.message || "Impossible de charger les tâches pour le moment.");
    } finally {
      setIsLoading(false); // Finish loading
    }
  }, []); // useCallback with empty dependency array for stability

  // --- Fetch tasks on component mount ---
  // This useEffect depends on `fetchTasks`. Thanks to `useCallback`,
  // `fetchTasks` doesn't change on every render, preventing unnecessary calls.
  // The `key={taskListKey}` passed from Dashboard also forces re-mounting
  // and thus re-execution of this `useEffect` when a task is added.
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // Dependency array includes fetchTasks

  // --- Function to toggle task completion status ---
  const handleToggle = useCallback(async (taskId) => {
    // Optimistic update (more responsive UI)
    const originalTasks = [...tasks]; // Backup current state
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    setError(null); // Clear previous errors

    try {
      // API call to update the task. Adjust endpoint and method (PUT/PATCH) as needed.
      // Example: Using a dedicated toggle endpoint (often simpler)
      await api.patch(`/tasks/${taskId}/toggle`); // Adjust if your API uses PATCH or a different structure

      // If the API returns the updated task, you could use it, but often the optimistic update is enough:
      // const updatedTaskFromApi = response.data;
      // setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? updatedTaskFromApi : t));

    } catch (err) {
      console.error("Error updating task:", err.response || err);
      setError(err.response?.data?.message || "Impossible de mettre à jour la tâche.");
      // On error, revert to the previous state
      setTasks(originalTasks);
    }
  }, [tasks]); // Depends on 'tasks' for optimistic update

  // --- Function to delete a task ---
  const handleDelete = useCallback(async (taskId) => {
     // Optimistic update
     const originalTasks = [...tasks];
     setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
     setError(null);

    try {
      // API call to delete the task (adjust endpoint)
      await api.delete(`/tasks/${taskId}`);
      // Task is already removed from UI due to optimistic update
    } catch (err) {
      console.error("Error deleting task:", err.response || err);
      setError(err.response?.data?.message || "Impossible de supprimer la tâche.");
       // On error, revert to the previous state
       setTasks(originalTasks);
    }
  }, [tasks]); // Depends on 'tasks' for optimistic update

  // --- Filter tasks for display ---
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') {
      return !task.completed; // Return only non-completed tasks
    }
    if (filter === 'completed') {
      return task.completed; // Return only completed tasks
    }
    return true; // 'all': return all tasks
  });

  // --- Component Rendering ---
  return (
    // Main container with styling
    <div className="bg-white p-4 md:p-6 rounded-xl shadow space-y-4">
      {/* Filter section */}
      <div className="flex flex-wrap justify-center gap-2 pb-4 border-b border-gray-200 border-solid">
        <FilterButton label="Toutes" onClick={() => setFilter('all')} active={filter === 'all'} />
        <FilterButton label="Actives" onClick={() => setFilter('active')} active={filter === 'active'} />
        <FilterButton label="Terminées" onClick={() => setFilter('completed')} active={filter === 'completed'} />
      </div>

      {/* Conditional display: Loading, Error, or List */}
      {isLoading && (
         <div className="flex justify-center items-center py-6 text-gray-500">
           <Loader2 className="animate-spin mr-2" size={20} /> {/* Loading spinner */}
           <span>Chargement des tâches...</span>
         </div>
      )}

      {error && (
        // Improved error display
        <p className="text-center text-red-600 bg-red-100 p-3 rounded-md border border-red-200">{error}</p>
      )}

      {!isLoading && !error && (
        // Added min-height for better empty state visibility
        <div className="space-y-3 min-h-[100px]">
          {/* Message if no tasks match the filter */}
          {filteredTasks.length === 0 ? (
             <p className="text-center text-gray-500 py-6 italic">
               {filter === 'all' ? 'Aucune tâche pour le moment. Ajoutez-en une !' :
                filter === 'active' ? 'Aucune tâche active.' :
                'Aucune tâche terminée.'}
             </p>
          ) : (
            // Map over filtered tasks to display each TaskItem
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id} // Unique key for React
                task={task} // Pass the full task object
                // Pass the handler functions wrapped to include the taskId
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
