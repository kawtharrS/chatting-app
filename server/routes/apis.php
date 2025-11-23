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


    '/conversations/id'             => ['controller' => 'ConversationController', 'method' => 'getConversationsById'],
    '/conversations'                => ['controller' => 'ConversationController', 'method' => 'getAllConversations'],
    '/conversations/create'         => ['controller' => 'ConversationController', 'method' => 'insertConversation'],
    '/conversations/delete'         => ['controller' => 'ConversationController', 'method' => 'deleteConversations'],
    '/conversations/update'         => ['controller' => 'ConversationController', 'method' => 'updateConversations'],
    '/conversations/chat'           => ['controller' => 'ConversationController', 'method' => 'getConversationBetweenUsers'],

    
    '/messages/id'             => ['controller' => 'MessageController', 'method' => 'getMessagesById'],
    '/messages'                => ['controller' => 'MessageController', 'method' => 'getAllMessages'],
    '/messages/create'         => ['controller' => 'MessageController', 'method' => 'insertMessage'],
    '/messages/delete'         => ['controller' => 'MessageController', 'method' => 'deleteMessages'],
    '/messages/update'         => ['controller' => 'MessageController', 'method' => 'updateMessages'],

    '/notifications/id'             => ['controller' => 'NotificationController', 'method' => 'getNotificationsById'],
    '/notifications'                => ['controller' => 'NotificationController', 'method' => 'getAllNotifications'],
    '/notifications/create'         => ['controller' => 'NotificationController', 'method' => 'insertNotifications'],
    '/notifications/delete'         => ['controller' => 'NotificationController', 'method' => 'deleteCNotifications'],
    '/notifications/update'         => ['controller' => 'NotificationController', 'method' => 'updateNotifications'],

];


?>