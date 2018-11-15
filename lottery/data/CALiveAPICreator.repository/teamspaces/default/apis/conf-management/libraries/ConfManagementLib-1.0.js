var Config = {  // a common technique for name-spacing in JavaScipt
    created: new Date(),
    save: function save(aMkt) {
        Config.settings = aMkt;
        Config.modified = new Date();
        // print("ConfManagementLib Config'd: " + JSON.stringify(Config));
    }
};

print("\nConfig loaded: " + JSON.stringify(Config) + "\n");
