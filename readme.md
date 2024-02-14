run this 
create new database as demo and run this script

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    age INT NOT NULL,
    address JSONB NULL,
    additional_info JSONB NULL
);

run command 
npm install
node server_csv_todb.js

open postman 
as post http://localhost:3000/convert-csv
check db 