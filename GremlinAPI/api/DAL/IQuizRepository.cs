using Gremlin.Models;

namespace Gremlin.DAL;

public interface IQuizRepository
{
	Task<IEnumerable<Quiz>?> GetAll();
    Task<Quiz?> GetItemById(int id);
	Task<bool> Create(Quiz quiz);
    Task<bool> Update(Quiz quiz);
    Task<bool> Delete(int id);
}