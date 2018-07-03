spawn scp -r test-output root@9.42.23.217:/root

expect "Please type 'yes' or 'no':"

send yes\n;

expect "password:"

send us3rpa88\n;

interact