#Echoes API

To build:

```
$npm install
```

To start:

Start the mongodb database at local then:

```
$npm start
```

##API Doc

- GET /records

	returns all meta data of the saved records.

- GET /records/:id

	returns the audio file of the record with the given id.

- POST /records/meta

	saves the meta data and returns the id for audio file upload.

- POST /records/:id

	uploads the raw record file and associates with the meta data belong to given id.

Data schemas:

```
body 
{
	title: string,
	location : {
		lat: number,
		lon: number
	}
}
```

- /records/upload/:id

	uploads the audio file.

	(body/form-data)