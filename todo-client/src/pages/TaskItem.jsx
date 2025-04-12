// Dans TaskItem.jsx
import React from "react";
// Importer les icônes nécessaires, y compris X ou Undo2
import { Trash, Check, X } from "lucide-react";

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow">
      <span
        // Ajout de marge à droite pour l'espacement
        className={`flex-1 mr-3 ${
          task.completed ? "line-through text-gray-400" : "text-gray-800"
        }`}
      >
        {task.title}
        {/* Optionnel: Afficher la description si elle existe */}
        {task.description && (
           <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-500'}`}>
             {task.description}
           </p>
        )}
      </span>
      <div className="flex gap-2">
        {/* --- Bouton Toggle Modifié --- */}
        <button
          onClick={onToggle}
          // Changer le style en fonction de l'état 'completed'
          className={`p-2 rounded-full transition ${
            task.completed
              ? "bg-gray-100 hover:bg-gray-200" // Style si terminée (ex: gris)
              : "bg-green-100 hover:bg-green-200" // Style si non terminée (vert)
          }`}
          // Ajouter un titre pour indiquer l'action
          title={task.completed ? "Marquer comme non terminée" : "Marquer comme terminée"}
        >
          {/* Afficher l'icône correspondante */}
          {task.completed ? (
            // Icône si la tâche EST terminée (ex: une croix)
            <X className="text-gray-500" size={18} />
          ) : (
            // Icône si la tâche N'EST PAS terminée (la coche)
            <Check className="text-green-600" size={18} />
          )}
        </button>
        {/* --- Fin Bouton Toggle Modifié --- */}

        <button
          onClick={onDelete}
          className="bg-red-100 hover:bg-red-200 p-2 rounded-full transition" // Ajout transition
          title="Supprimer la tâche" // Ajout title
        >
          <Trash className="text-red-600" size={18} />
        </button>
      </div>
    </div>
  );
}
