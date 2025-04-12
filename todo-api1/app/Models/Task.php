<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    //Explication : Laravel utilise la protection contre l’assignment de masse pour éviter que des champs non prévus soient insérés dans la BDD par erreur. Tu dois donc spécifier manuellement les champs que tu veux autoriser
    //à être remplis par l’utilisateur. C’est ce que fait la propriété $fillable.
    protected $fillable = [
        'title',
        'description',
        'completed', // si tu as ce champ aussi
    ];
    
}
