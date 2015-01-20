var fs = require('fs');
var path = require('path');
var xfs = require('xfs');

var base = path.join(__dirname, '../data/3worldwishes/');
xfs.walk(base, function (err, file, done) {
	var relPath = file.substr(base.length);
	var relPaths = relPath.split('.');

	var name = relPaths[0];
	var type = relPaths[1];

	var bolImage = ['jpg', 'JPG', 'png', 'PNG', 'gif', 'GIF'].indexOf(type) != -1;
	var bolVideo = ['mov', 'avi', 'wmv'].indexOf(type) != -1;

	if(bolImage||bolVideo){
		var obj = {};
		var infos = name.split('/');
		var latlng = infos[1].split('|');
		obj.lng = latlng[1];
		obj.lat = latlng[2];

		var info = infos[infos.length-1];
		var names = info.split('|');
		obj.name = names[0];
		obj.area = names[1];
		obj.helper = names[2];

		obj.type =type;

		var fileName = JSON.stringify(obj).replace(/:/g,'@')+'.'+type;
		var dest = path.join(__dirname, '../release', fileName);
		console.log(dest)
	  xfs.save(dest, xfs.readFileSync(file), function (e) {console.log(e)});
	}
	done();
});

var str = 'a_b|c|d|e_xxx.jpg';
str.split('_')[1].split('|');


var base = path.join(__dirname, '../data/3worldwishes/');

function traverPath(base,fArr) {
	// var level1 = level+1;
	var arr = fs.readdirSync(base);
	for (var k = 0; k < arr.length; k++) {
		var name = arr[k];
		var base1 = path.join(base, name);
		var stat = fs.statSync(path.join(base, name));
		if (stat.isDirectory()) {
			traverPath(base1,fArr);
		} else {
			try {
        var suffix = name.split(".")[1];
				var bolImage = ['jpg', 'JPG', 'png', 'PNG', 'gif', 'GIF'].indexOf(suffix) != -1;
				var bolVideo = ['mov', 'avi', 'wmv'].indexOf(suffix) != -1;
				if(bolImage||bolVideo){
					objFile = {};
					if(bolImage){
						objFile.type = 'image';
					}
					if(bolVideo){
						objFile.type = 'video';
					}
					objFile.url = base1;
					fArr.push(objFile);
				}
			} catch (e) {}
		}
	}
}

exports.write = function() {
	var base = '../data/3worldwishes/';

	var countriesList = fs.readdirSync(base);
	for(var k = countriesList.length-1;k>=0;k--){
		var name = countriesList[k];
		var ps = path.join(base, name)
		var stat = fs.statSync(path.join(base, name));
		if (!stat.isDirectory()) {
			countriesList.splice(k,1);
		}
	}

	var countries = {};
	for(var k in countriesList){
		var name  = countriesList[k];
		var obj = countries[name] = {};
		var arr = obj.urls = [];
		var base1 =  path.join(base, name);

		var urlJson = path.join(base1, 'info.json');
		obj.urlJson = urlJson;
		traverPath(base1, arr);
	}


	fs.writeFileSync('../data/dictionary.js',
		'window.worldObj =' + JSON.stringify(countries)+'\n'+'window.worldArr =' + JSON.stringify(countriesList));
}


// exports.write();
