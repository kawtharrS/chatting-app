<?php 

//array of routes - a mapping between routes and controller name and method!
$apis = [
    '/users/id'             => ['controller' => 'UserController', 'method' => 'getUserById'],
    '/users'                => ['controller' => 'UserController', 'method' => 'getAllUsers'],
    '/users/create'         => ['controller' => 'UserController', 'method' => 'insertUser'],
    '/users/delete'         => ['controller' => 'UserController', 'method' => 'deleteUser'],
    '/users/update'         => ['controller' => 'UserController', 'method' => 'updateUser'],
    '/users/email'          => ['controller' => 'UserController', 'method' => 'getUserByEmail'],

    '/contacts/id'             => ['controller' => 'ContactController', 'method' => 'getContactById'],
    '/contacts'                => ['controller' => 'ContactController', 'method' => 'getAllContacts'],
    '/contacts/create'         => ['controller' => 'ContactController', 'method' => 'insertContact'],
    '/contacts/delete'         => ['controller' => 'ContactController', 'method' => 'deleteContact'],
    '/contacts/update'         => ['controller' => 'ContactController', 'method' => 'updateContact'],
    '/contacts/email'         => ['controller' => 'ContactController', 'method' => 'getContactByEmail'],


    '/conversations/id'             => ['controller' => 'ConversationsController', 'method' => 'getConversationsById'],
    '/conversations'                => ['controller' => 'ConversationsController', 'method' => 'getAllConversations'],
    '/conversations/create'         => ['controller' => 'ConversationsController', 'method' => 'insertConversations'],
    '/conversations/delete'         => ['controller' => 'ConversationsController', 'method' => 'deleteConversations'],
    '/conversations/update'         => ['controller' => 'ConversationsController', 'method' => 'updateConversations'],
    
    '/messages/id'             => ['controller' => 'MessagesController', 'method' => 'getMessagesById'],
    '/messages'                => ['controller' => 'MessagesController', 'method' => 'getAllMessages'],
    '/messages/create'         => ['controller' => 'MessagesController', 'method' => 'insertMessages'],
    '/messages/delete'         => ['controller' => 'MessagesController', 'method' => 'deleteMessages'],
    '/messages/update'         => ['controller' => 'MessagesController', 'method' => 'updateMessages'],

    '/notifications/id'             => ['controller' => 'NotificationsController', 'method' => 'getNotificationsById'],
    '/notifications'                => ['controller' => 'NotificationsController', 'method' => 'getAllNotifications'],
    '/notifications/create'         => ['controller' => 'NotificationsController', 'method' => 'insertNotifications'],
    '/notifications/delete'         => ['controller' => 'NotificationsController', 'method' => 'deleteCNotifications'],
    '/notifications/update'         => ['controller' => 'NotificationsController', 'method' => 'updateNotifications'],

];


