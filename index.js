var fs = require('fs');

var apply_variable = function(src, target, objects)
{
    var content = fs.readFileSync(src).toString('utf8');
    for(key in objects) {
        if (objects.hasOwnProperty(key)) {
            content = content.replace('<' + key + '>', objects[key]);
        }
    };
    if (fs.existsSync(target)) {
        fs.unlinkSync(target);
    }
    fs.writeFileSync(target, content);
}

var build_application_configs = function(cfile, environment)
{
    if (!fs.existsSync(cfile)) {
        console.error('Build config file not found');
        return false;
    }
    var configs = JSON.parse(fs.readFileSync(cfile));
    if(typeof configs.templates !== 'undefined') {
        for (var template_path in configs.templates) {
            if (configs.templates.hasOwnProperty(template_path)) {
                if (fs.existsSync(template_path)) {
                    var runtime_variables = {};
                    for(var i=0; i<configs.variables.length; i++) {
                        if(process.env[environment + '_' + configs.variables[i]]) {
                            runtime_variables[configs.variables[i]] = process.env[environment + '_' + configs.variables[i]]
                        } else {
                            runtime_variables[configs.variables[i]] = process.env[configs.variables[i]]
                        }
                    }
                    apply_variable(template_path, configs.templates[template_path], runtime_variables);
                }
            }
        }
    }
};

build_application_configs(process.argv[3], process.argv[2]);