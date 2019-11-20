#!/bin/sh

# run command ./load-data.sh | jq '.'


# purge all 3 collections

cd /dummy-data

apk add jq curl

echo ${SERVER_PORT}
echo ${SERVER_HOST}

sleep 10

# load the interests
jq -M -r '
    .[] | ._id, .category, .name
' "interests.json" | \
while read -r _id; read -r category; read -r name; do
    url="http://${SERVER_HOST}:${SERVER_PORT}/v1/interests/addInterest"

    curl -d "{\"name\":\"$name\", \"category\":\"$category\"}" \
         -H "Content-Type: application/json" \
         -X POST ${url}
done



# get the list of interests and pipe the first '._id' to the user profiles
url="http://${SERVER_HOST}:${SERVER_PORT}/v1/interests/getAllInterests"

interestId1=$( curl -s -X GET http://${SERVER_HOST}:${SERVER_PORT}/v1/interests/getAllInterests | jq '.interest[0]._id' )
interestId2=$( curl -s -X GET http://${SERVER_HOST}:${SERVER_PORT}/v1/interests/getAllInterests | jq '.interest[1]._id' )
interestId3=$( curl -s -X GET http://${SERVER_HOST}:${SERVER_PORT}/v1/interests/getAllInterests | jq '.interest[3]._id' )
# echo $interestId

# echo "reading: " + jq '. | length' users-large.json + " users from users-large.json file"
# echo "reading: " + jq '. | length' users.json + " users from users.json file"

# load the user data & matches
jq -M -r '
    .[] | .name, .age, .interests, .matches, .loginCredentials.email, .loginCredentials.password, 
    .location.latitude, .location.longitude, .location.city, .loginMetrics.isLoggedIn
' "users.json" | \
while read -r name; read -r age; read -r interests; read -r matches; read -r email;  read -r password; \
      read -r latitude; read -r longitude; read -r city; read -r isLoggedIn; do

    url="http://${SERVER_HOST}:{$SERVER_PORT}/v1/user/register"

    curl -d "{\"name\":\"$name\", \"age\":\"$age\", \"interests\":[$interestId1, $interestId2, $interestId3], \"matches\":[], \"loginCredentials\":{\"email\":\"$email\",\"password\":\"$password\" }, \"location\":{\"latitude\":\"$latitude\",\"longitude\":\"$longitude\",\"city\":\"$city\" }, \"loginMetrics\":{\"isLoggedIn\":\"$isLoggedIn\" } }" \
         -H "Content-Type: application/json" \
         -X POST ${url}
done


