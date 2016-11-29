#Echoes API

-To build:
$npm install
$start the mongodb database
$npm start

##API Doc

-/records
*returns all meta data of the saved records.

-/records/:id
*returns the audio file of the record with the given id.

-/records/meta
*saves the meta data and returns the id for audio file upload.

body 
{
	title: string,
	position: {
		lat: string,
		lang: string
	}
}

-/records/upload/:id
*uploads the audio file.
(body/form-data)