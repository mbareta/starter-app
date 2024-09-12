# Courses Module

This module provides Tailor course functionality. It allows listing courses from
course catalog, importing and viewing those courses.

## Importing Courses

Tailor export should be located in `PROJECT_ROOT/server/data`. The directory is
gitignored so you need to make your own Tailor course.

## Course Model

We store most data from Tailor. Currently, `uid` is not used anywhere.
`sourceId` is used for module fetching where we need to know the Tailor course ID
and container ID to be able to pull the correct json file.
`structure` holds the entire course module tree and the UI can be built from this
property.

## Courses Repository

This module is a simple wrapper of MikroORM EntityRepository.
Docs here: https://mikro-orm.io/api/knex/class/EntityRepository

## Controller endpoints

- GET /courses - returns all courses
- GET /courses/catalog - returns all courses from Tailor catalog
- GET /courses/:id/module/:moduleId - gets course module data
- POST /courses - imports course from Tailor storage
- DELETE /users/:id - deletes a course from the DB (courses are not soft-deleted)
