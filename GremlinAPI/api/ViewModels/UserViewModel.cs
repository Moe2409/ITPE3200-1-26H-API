using Microsoft.AspNetCore.Identity;
using Gremlin.Models;

namespace Gremlin.ViewModels;

public class UserViewModel
{
    public AuthUser User { get; set; } = null!;
    public IEnumerable<Quiz> Quizzes { get; set; } = new List<Quiz>();
    public IEnumerable<History> Histories { get; set; } = new List<History>();

    public UserViewModel(AuthUser user, IEnumerable<Quiz> quizzes, IEnumerable<History> histories)
    {
        User = user;
        Quizzes = quizzes;
        Histories = histories;
    }
}