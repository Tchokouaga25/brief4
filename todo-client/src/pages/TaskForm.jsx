// Dans TaskForm.jsx

import React, { useState, useEffect } from "react"; // Ajouter useEffect
import api from "../api/axios";

// Accepter la prop onTaskAdded
export default function TaskForm({ onTaskAdded }) { 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // État pour le message de succès

  // Effacer le message de succès après quelques secondes
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000); // Message affiché pendant 3 secondes
      return () => clearTimeout(timer); // Nettoyer le timer si le composant est démonté
    }
  }, [successMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    setError(null); 
    setSuccessMessage(""); // Réinitialiser le message de succès

    try {
      await api.post("/tasks", { title, description });

      // Réinitialiser le formulaire
      setTitle("");
      setDescription("");
      
      setSuccessMessage("Tâche ajoutée avec succès !"); // Afficher le message de succès

      // Informer le composant parent que la tâche a été ajoutée
      // C'est crucial pour rafraîchir la liste
      if (onTaskAdded) {
        // Vous pouvez passer la nouvelle tâche si l'API la retourne et que vous en avez besoin
        // onTaskAdded(response.data); 
        onTaskAdded(); // Appeler la fonction sans argument suffit pour déclencher le rafraîchissement
      }

    } catch (err) {
      console.error("Erreur lors de l'ajout de la tâche", err);
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'ajout.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-white rounded-xl shadow">
      {/* Affichage de l'erreur */}
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {/* Affichage du message de succès */}
      {successMessage && <p className="text-green-600 text-sm mb-2">{successMessage}</p>}

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Champ Titre */}
        <div className="flex-1">
          <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre de la tâche
          </label>
          <input
            id="task-title"
            type="text"
            placeholder="Entrer le titre de la tache"
            className="w-full px-4 py-2 border border-gray-300 border-solid rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading} 
          />
        </div>

        {/* Champ Description */}
        <div className="flex-1">
           <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description 
          </label>
          <input
            id="task-description"
            type="text"
            placeholder="Description de la tâche"
            className="w-full px-4 py-2 border border-gray-300 border-solid rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading} 
          />
        </div>
      </div>

      {/* Bouton Ajouter */}
      <button
        type="submit"
        disabled={isLoading || !title} 
        className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Ajout en cours...' : 'Ajouter la tâche'}
      </button>
    </form>
  );
}
