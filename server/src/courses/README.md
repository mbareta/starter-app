# Courses Module

This module provides Tailor course functionality. It allows listing courses from
course catalog, importing and viewing those courses.

The course update functionality is missing on purpose. If your implementation
requires it, it should be fairly easy to add, but it is outside of the starter
app scope.

## Importing Courses

For importing courses, we need to set up S3 bucket where Tailor will publish its
JSON files. Check out .env.example for variable names, but essentially, we need
to create AWS S3 bucket, credentials (access key and secret) and specify region.

### Import Tests

We don't want to fetch data from S3 when testing so we have a setup where the
mock JSON files are written to the disk and then read from the disk when running
tests.

## File Service

This is very specific service used for:

1. retrieving files from Tailor S3 bucket
2. storing files to Starter S3 bucket
3. getting signed download URLs for assets

This can be abstracted to a global S3 file service with generic GET and PUT
object commands if we need to work with S3 elsewhere.

This service makes it easy to transfer assets from Tailor bucket to app bucket
by implementing a wrapper around AWS SDK for S3. It also makes it easy to request
a presigned download URL.

Instead of presigning all of the asset URLs (currently, only images are assets),
our client component requests a signed download URL when it is mounted. That way
the initial API response is a bit quicker since it doesn't need to scan for asset
paths and sign them. And components that render assets simply request them when
they are actually viewed.

## Course Model

We store most data from Tailor. Currently, `uid` is not used anywhere.
`sourceId` is used for module fetching where we need to know the Tailor course ID
and container ID to be able to pull the correct json file.
`structure` holds the entire course module tree and the UI can be built from this
property.

## Course Page model

Instead of pulling JSON data from S3 and parsing it to access container data,
we simply store the pages to the DB. This allows us faster access and ability to
include them as childrenof the course model in a single efficient request.
It also allows us to use its primary key if we want to add relationships in the DB.

## Courses Repository & CoursePages Repository

The modules are a simple wrapper of MikroORM EntityRepository.
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
- GET /courses/asset-url?path=<path> - gets signed asset download URL (AWS S3)
- POST /courses - imports course from Tailor storage
- DELETE /users/:id - deletes a course from the DB (courses are not soft-deleted)
