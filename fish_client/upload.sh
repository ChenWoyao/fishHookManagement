yarn build
ssh root@132.232.45.179 "rm -rf /root/shopping-cart/fish_server_test/upload"
scp -r ~/Desktop/fishHookManagement/fish_client/dist/* root@132.232.45.179:/root/shopping-cart/fish_server_test/upload

# pm2 stop fishClient
# pm2
