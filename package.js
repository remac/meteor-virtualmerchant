Package.describe({
  summary: "VirtualMerchant Gateway"
});

Package.on_use(function (api) {
  api.add_files('virtualmerchant.js', 'server');
});
