# Contributing to Warehouse Management System

Thank you for your interest in contributing to this project!

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Warehouse-Systems-Template.git`
3. Install dependencies for both backend and frontend (see QUICKSTART.md)
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid using `any` type unless absolutely necessary

### Backend

- Follow RESTful API conventions
- Use async/await for asynchronous operations
- Add proper error handling
- Document new endpoints in README.md

### Frontend

- Use functional components with hooks
- Keep components small and focused
- Use the existing API service layer for backend calls
- Follow the existing CSS styling patterns

## Project Structure

```
backend/
├── src/
│   ├── models/      # Database models and types
│   ├── routes/      # API route handlers
│   └── index.ts     # Server entry point
└── uploads/         # File upload directory

frontend/
├── src/
│   ├── components/  # React components
│   ├── services/    # API service layer
│   ├── types/       # TypeScript types
│   └── App.tsx      # Main app component
```

## Adding New Features

### Backend

1. **Database Changes**: Update `backend/src/models/database.ts` with new tables/columns
2. **Types**: Add TypeScript interfaces in `backend/src/models/types.ts`
3. **Routes**: Create route handlers in `backend/src/routes/`
4. **Register Routes**: Import and register routes in `backend/src/index.ts`

### Frontend

1. **Types**: Add interfaces in `frontend/src/types/index.ts`
2. **API Service**: Add API methods in `frontend/src/services/api.ts`
3. **Components**: Create React components in `frontend/src/components/`
4. **Integration**: Add to `frontend/src/App.tsx` navigation

## Testing

Before submitting a PR:

1. **Backend**: Run `npm run build` in the backend directory
2. **Frontend**: Run `npm run build` in the frontend directory
3. Test your changes locally
4. Ensure all existing functionality still works

## Commit Messages

Use clear, descriptive commit messages:

- `feat: Add inventory export feature`
- `fix: Correct inventory calculation bug`
- `docs: Update API documentation`
- `refactor: Improve order linking logic`

## Pull Request Process

1. Update README.md with details of changes if applicable
2. Update QUICKSTART.md if setup process changes
3. Ensure your code builds without errors
4. Create a pull request with a clear description of changes
5. Link any related issues

## Common Tasks

### Adding a New API Endpoint

1. Create route handler in `backend/src/routes/`
2. Add type definitions if needed
3. Register route in `backend/src/index.ts`
4. Add API method in `frontend/src/services/api.ts`
5. Update documentation

### Adding a New UI Component

1. Create component file in `frontend/src/components/`
2. Add necessary types in `frontend/src/types/`
3. Connect to API service
4. Add to navigation if needed
5. Style using existing CSS patterns

### Database Schema Changes

⚠️ **Important**: Schema changes affect existing databases

1. Update `backend/src/models/database.ts`
2. Consider data migration needs
3. Document breaking changes
4. Update types accordingly

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about the codebase
- Suggestions for improvements

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what is best for the community

Thank you for contributing! 🎉
