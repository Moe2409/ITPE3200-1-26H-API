using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Gremlin.Models;

namespace Gremlin.DTOs;

public class Quiz
{
    
    public int id {get; set;}
    public AuthUser? user {get; set;}
    
    public string? title {get; set;}

    // Nested DTO list representing related question data, not a database navigation property
    public List<Question> Questions { get; set; } = new List<Question>();


}