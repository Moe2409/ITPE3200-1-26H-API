using Microsoft.EntityFrameworkCore;
using Gremlin.Models;

namespace Gremlin.DAL;

public class QuizRepository : IQuizRepository
{
    private readonly GremlinDbContext _db;

    private readonly ILogger<QuizRepository> _logger;

    public QuizRepository(GremlinDbContext db, ILogger<QuizRepository> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<IEnumerable<Quiz>?> GetAll()
    {
        try
        {
            return await _db.Quizzes
            .Include(q => q.User)
            .Include(q => q.Questions)
            .ToListAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("[QuizRepository] items ToListAsync() failed when GetAll(), error message: {e}", e.Message);
            return null;
        }
    }

    public async Task<Quiz?> GetItemById(int id)
    {
        try
        {
            return await _db.Quizzes
            .Include(q => q.User)
            .Include(q => q.Questions)
            .FirstOrDefaultAsync(q => q.id == id);
        }
        catch (Exception e)
        {
            _logger.LogError("[QuizRepository] item FindAsync(id) failed when GetItemById for ItemId {ItemId:0000}, error message: {e}", id, e.Message);
            return null;
        }
    }

    public async Task<bool> Create(Quiz item)
    {
        try
        {
            _db.Quizzes.Add(item);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[QuizRepository] item creation failed for item {@item}, error message: {e}", item, e.Message);
            return false;
        }
    }

    public async Task<bool> Update(Quiz item)
    {
        try
        {
            _db.Quizzes.Update(item);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[QuizRepository] item FindAsync(id) failed when updating the ItemId {ItemId:0000}, error message: {e}", item, e.Message);
            return false;
        }
    }

    public async Task<bool> Delete(int id)
    {
        try
        {
            var item = await _db.Quizzes.FindAsync(id);
            if (item == null)
            {
                _logger.LogError("[ItemRepository] item not found for the ItemId {ItemId:0000}", id);
                return false;
            }

            _db.Quizzes.Remove(item);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError("[QuizRepository] item deletion failed for the ItemId {ItemId:0000}, error message: {e}", id, e.Message);
            return false;
        }
    }
}