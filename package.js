Package.describe({
    summary: "VirtualMerchant Gateway"
});

Package.on_use(function (api) {
    if (typeof api.export !== 'undefined') {
        api.export('VirtualMerchant', 'server');
    }
    api.add_files('virtualmerchant.js', 'server');
});
