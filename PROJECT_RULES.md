# Apple-A-Day Project Rules

- Keep authentication, student, admin, and support UI under `src/features/`.
- Keep shared business operations under `src/services/`.
- Keep global Redux state under `src/store/`; do not create role-specific slices.
- Reuse shared services, constants, models, hooks, and components across roles.
