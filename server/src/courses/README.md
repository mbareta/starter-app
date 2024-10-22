# Courses Module

This module provides Tailor course functionality. It allows listing courses from
course catalog, importing and viewing those courses.

The course update functionality is missing on purpose. If your implementation
requires it, it should be fairly easy to add, but it is outside of the starter
app scope.

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

## Course Page Model and Repository

CoursePage entity is used to store Tailor container data. This is the actual
page that contains the teaching elements. Usually, it is pulled from S3 but
this implementation stores the data in the database, binds it to a course with
a foreign key and allows easier fetch.

## Controller endpoints

- GET /courses - returns all courses
- GET /courses/catalog - returns all courses from Tailor catalog
- GET /courses/:id/page/:pageId - gets course page data
- POST /courses - imports course from Tailor storage
- DELETE /users/:id - deletes a course from the DB (courses are not soft-deleted)
