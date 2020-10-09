const ini = require('ini');
const multiLine = require('multi-ini');
const childProcess = require('child_process');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const copyFileSync = require('fs-copy-file-sync'); // shim in case user has node < v8.5.0
const jsonfile = require('jsonfile');

const serverPath = '/acServer/';
const contentPath = '/acServer/content';
const isRunningOnWindows = /^win/.test(process.platform);

var acServerStatus = 0;
var sTrackerServerStatus = 0;
var acServerPid;
var sTrackerServerPid;
var acServerLogName;
var acServerLog = [];

var currentSession = "stopped";

try {
	var config =  multiLine.read(serverPath + 'cfg/server_cfg.ini', {encoding: 'utf8'});
	var entryList =  multiLine.read(serverPath + 'cfg/entry_list.ini', {encoding: 'utf8'});
	var ksTyres =  multiLine.read(serverPath + 'manager/ks_tyres.ini', {encoding: 'utf8'});
} catch (e) {
}

function checkLocalContentPath(contentPath) {
	return contentPath;
}
function saveConfig() {
	try {
		fs.writeFileSync(serverPath + 'cfg/server_cfg.ini', ini.stringify(config).replace(/\\/gi,''));
	} catch (e) {
	}
}

function saveEntryList() {
	try {
		fs.writeFileSync(serverPath + 'cfg/entry_list.ini', ini.stringify(entryList).replace(/\\/gi,''));
	} catch (e) {
	}
}

function saveModTyres() {
    try {
        fs.writeFileSync(serverPath + 'manager/mod_tyres.ini', ini.stringify(modTyres).replace(/\\/gi, ''));
    } catch (e) {
    }
}

function getDirectories(srcpath) {
	try {
		return fs.readdirSync(srcpath).filter(function (file) {
			return fs.statSync(srcpath + '/' + file).isDirectory();
		});
	} catch (e) {
	}
}

function getDateTimeString() {
	try {
		var d = new Date();
		return d.getFullYear() + ('0' + d.getMonth()).slice(-2) + ('0' + d.getDate()).slice(-2) + '_' + ('0' + d.getHours()).slice(-2) + ('0' + d.getMinutes()).slice(-2) + ('0' + d.getSeconds()).slice(-2);
	} catch (e) {
	}
}

function writeLogFile(filename, message) {
	try {
		fs.appendFile(__dirname + '/logs/' + filename, message + '\r\n', function (err) {});
	} catch (e) {
	}
}

function updateServerLog(log) {
}

// get complete configuration
module.exports.getCompleteConfiguration = function() {
  try {
    return config;
  } catch (e) {
    return {};
  }
}

// get server config
module.exports.getServerConfig = function() {
  return config.SERVER;
}

// get server status
module.exports.getServerStatus = function() {
  return currentSession
}

// get server config by id
module.exports.getServerConfigById = function(key) {
  try {
    return config.SERVER[key.toUpperCase()];
  } catch (e) {
    return {}
  }
}

// post new server config
module.exports.postNewServerConfig = function(req, res) {
  try {
    for (var param in req.body) {
      config.SERVER[param.toUpperCase()] = req.body[param];
    }
    
    saveConfig();
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// post server config by id
module.exports.postServerConfigById = function(key, value) {
  try {
    config.SERVER[key.toUpperCase()] = value;
    saveConfig();
    return true;
  }
  catch (e) {
    return false;
  }
}

// get booking config
module.exports.getBookingConfig = function(req, res) {
  try {
    res.status(200);
    res.send(config.BOOK);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get booking config by id
module.exports.getBookingConfigById = function(req, res) {
  try {
    res.status(200);
    res.send(config.BOOK[req.params.id.toUpperCase()]);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// post new booking config
module.exports.postNewBookingConfig = function(req, res) {
  try {
    if (!Object.keys(req.body).length) {
      if (config.BOOK) {
        delete config.BOOK;
      }
    } else {
      if (config.BOOK === undefined) {
        config.BOOK = {};
      }
      for (var param in req.body) {
        config.BOOK[param.toUpperCase()] = req.body[param];
      }
    }
    
    saveConfig();
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// post booking config by id
module.exports.postBookingConfigById = function(req, res) {
  try {
    config.BOOK[req.params.id.toUpperCase()] = req.body.value;
    saveConfig();
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get practice config
module.exports.getPracticeConfig = function(req, res) {
  try {
    res.status(200);
    res.send(config.PRACTICE);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get practice config by id
module.exports.getPracticeConfigById = function(req, res) {
  try {
    res.status(200);
    res.send(config.PRACTICE[req.params.id.toUpperCase()]);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// post new practice config
module.exports.postNewPracticeConfig = function(req, res) {
  try {
    if (!Object.keys(req.body).length) {
      if (config.PRACTICE) {
        delete config.PRACTICE;
      }
    } else {
      if (config.PRACTICE === undefined) {
        config.PRACTICE = {};
      }
      for (var param in req.body) {
        config.PRACTICE[param.toUpperCase()] = req.body[param];
      }
    }
    
    saveConfig();
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
  
}

// post practice config by id
module.exports.postPracticeConfigById = function(req, res) {
  try {
    config.PRACTICE[req.params.id.toUpperCase()] = req.body.value;
    saveConfig();
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get qualify config
module.exports.getQualifyConfig = function(req, res) {
  try {
    res.send(config.QUALIFY);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get qualify config by id
module.exports.getQualifyConfigById = function(req, res) {
  try {
    res.status(200);
    res.send(config.QUALIFY[req.params.id.toUpperCase()]);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
  
}

// post new qualify config
module.exports.postNewQualifyConfig = function(req, res) {
  try {
    if (!Object.keys(req.body).length) {
      if (config.QUALIFY) {
        delete config.QUALIFY;
      }
    } else {
      if (config.QUALIFY === undefined) {
        config.QUALIFY = {};
      }
      for (var param in req.body) {
        config.QUALIFY[param.toUpperCase()] = req.body[param];
      }
    }
    
    saveConfig();
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// post qualify config
module.exports.postQualifyConfig = function(req, res) {
  try {
    config.QUALIFY[req.params.id.toUpperCase()] = req.body.value;
    saveConfig();
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get race config
module.exports.getRaceConfig = function(req, res) {
  try {
    res.status(200);
    res.send(config.RACE);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get race config by id
module.exports.getRaceConfigById = function(req, res) {
  try {
    res.send(config.RACE[req.params.id.toUpperCase()]);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// post new race config
module.exports.postNewRaceConfig = function(req, res) {
  try {
    if (!Object.keys(req.body).length) {
      if (config.RACE) {
        delete config.RACE;
      }
    } else {
      if (config.RACE === undefined) {
        config.RACE = {};
      }
      for (var param in req.body) {
        config.RACE[param.toUpperCase()] = req.body[param];
      }
    }
    
    saveConfig();
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// post race config by id
module.exports.postRaceConfigById = function(req, res) {
  try {
    config.RACE[req.params.id.toUpperCase()] = req.body.value;
    saveConfig();
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get dynamictrack config
module.exports.getDynamictrackConfig = function(req, res) {
  try {
    res.status(200);
    res.send(config.DYNAMIC_TRACK);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get dynamictrack config by id
module.exports.getDynamictrackConfigById = function(req, res) {
  try {
    res.status(200);
    res.send(config.DYNAMIC_TRACK[req.params.id.toUpperCase()]);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// post dynamictrack config
module.exports.postDynamictrackConfig = function(req, res) {
  try {
    if (!Object.keys(req.body).length) {
      if (config.DYNAMIC_TRACK) {
        delete config.DYNAMIC_TRACK;
      }
    } else {
      if (config.DYNAMIC_TRACK === undefined) {
        config.DYNAMIC_TRACK = {};
      }
      for (var param in req.body) {
        config.DYNAMIC_TRACK[param.toUpperCase()] = req.body[param];
      }
    }
    
    saveConfig();
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// post track dynamictrack config by id
module.exports.postTrackDynamictrackConfigById = function(req, res) {
  try {
    config.DYNAMIC_TRACK[req.params.id.toUpperCase()] = req.body.value;
    saveConfig();
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get weather config
module.exports.getWeatherConfig = function(req, res) {
  try {
    var weather = [];
    
    Object.keys(config).forEach(function (key) {
      if (key.indexOf('WEATHER_') === 0) {
        weather.push(config[key]);
      }
    });
    
    res.status(200);
    res.send(weather);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// post weather config
module.exports.postWeatherConfig = function(req, res) {
  try {
    Object.keys(config).forEach(function (key) {
      if (key.indexOf('WEATHER_') === 0) {
        delete config[key];
      }
    });
    
    for (var param in req.body) {
      config['WEATHER_' + param] = req.body[param];
    }
    
    saveConfig();
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get tracks available on server
module.exports.getTracksAvailableOnServer = function() {
  try {
    var trackNames = fs.readdirSync(contentPath + '/tracks');
    var tracks = [];
    
    for (var trackName in trackNames) {
      var track = {
        name: trackNames[trackName]
      };
      
      try {
        var configs = getDirectories(contentPath + '/tracks/' + trackNames[trackName] + '/ui');
        track.configs = configs;
      }
      catch (e) {
      }
      
      tracks.push(track);
    }
    
    return tracks;
  } catch (e) {
    return [];
  }
}

// get track
module.exports.getTrack = function(track) {
  try {
    var trackDetails = fs.readFileSync(contentPath + '/tracks/' + track + '/ui/ui_track.json', 'utf-8');
    return trackDetails;
  } catch (e) {
    return {}
  }
}

// remove existing track
module.exports.removeExistingTrack = function(req, res) {
  try {
    var track = removeSlashes(req.params.track);
    var serverTrackPath = serverPath + 'content/tracks/' + track;
    var contentTrackPath = checkLocalContentPath(contentPath) + '/tracks/' + track;
    rimraf.sync(serverTrackPath);
    rimraf.sync(contentTrackPath);
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get track image
module.exports.getTrackImage = function(req, res) {
  try {
    var image = fs.readFileSync(contentPath + '/tracks/' + req.params.track + '/ui/preview.png');
    res.status(200);
    res.contentType('image/jpeg');
    res.send(image);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get track config
module.exports.getTrackConfig = function(req, res) {
  try {
    var trackDetails = fs.readFileSync(contentPath + '/tracks/' + req.params.track + '/ui/' + req.params.config + '/ui_track.json', 'utf-8');
    res.status(200);
    res.send(trackDetails);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get track config image
module.exports.getTrackConfigImage = function(req, res) {
  try {
    var image = fs.readFileSync(contentPath + '/tracks/' + req.params.track + '/ui/' + req.params.config + '/preview.png');
    res.status(200);
    res.contentType('image/jpeg');
    res.send(image);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

function copyTrack(serverTrackPath, contentTrackPath, surfaces, drs_zones, preview, ui_track) {
  mkdirp.sync(serverTrackPath);
  mkdirp.sync(contentTrackPath);
  copyFileSync(surfaces.path, serverTrackPath + 'surfaces.ini');
  if (drs_zones !== null && drs_zones !== undefined) {
    copyFileSync(drs_zones.path, serverTrackPath + 'drs_zones.ini');
  }
  copyFileSync(preview.path, contentTrackPath + 'preview.png');
  copyFileSync(ui_track.path, contentTrackPath + 'ui_track.json');
}

function addSingleLayoutTrack(track) {
  var serverTrackPath = serverPath + 'content/tracks/' + track.name + '/data/';
  var contentTrackPath = checkLocalContentPath(contentPath) + '/tracks/' + track.name + '/ui/';
  copyTrack(serverTrackPath, contentTrackPath, track.layouts[0].surfaces, track.layouts[0].drs_zones, track.layouts[0].preview, track.layouts[0].ui_track);
}

function addMultiLayoutTrack(track) {
  var serverTrackPath = serverPath + 'content/tracks/' + track.name + '/';
  var contentTrackPath = checkLocalContentPath(contentPath) + '/tracks/' + track.name + '/ui/';
  
  _.forEach(track.layouts, function(layout) {
    var serverLayoutPath = serverTrackPath + layout.name + '/data/';
    var contentLayoutPath = contentTrackPath + layout.name + '/';
    copyTrack(serverLayoutPath, contentLayoutPath, layout.surfaces, layout.drs_zones, layout.preview, layout.ui_track);
  });
}

// store uploaded file for track
module.exports.storeUploadedFileForTrack = function(req, res) {
  try {
    var track = {
      name: removeSlashes(req.body.track.name),
      layouts: _.map(req.body.track.layouts, function(layout) {
        if (layout.name === 'null') {
          layout.name = null;
        } else {
          layout.name = removeSlashes(layout.name);
        }
        return layout;
      })
    };
    _.forEach(req.files, function(file) {
      var parts = _.split(file.fieldname, '][');
      var idx = _.parseInt(parts[1]);
      var key = parts[2].substr(0, parts[2].length - 1);
      track.layouts[idx][key] = file;
    });
    
    if (track.layouts.length > 1) {
      addMultiLayoutTrack(track);
    } else if (track.layouts.length === 1) {
      addSingleLayoutTrack(track);
    } else {
      throw 'Invalid layouts for track';
    }
    
    rimraf.sync('./uploads/' + req.uuid);
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get cars available on server
module.exports.getCarsAvailableOnServer = function(req, res) {
  try {
    contentPath = buildContentPath(serverPath);
    var cars = fs.readdirSync(contentPath + '/cars');
    res.status(200);
    res.send(cars);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

function mkdirCarSkins(car) {
  var skinPath = checkLocalContentPath(contentPath) + '/cars/' + car.name + '/skins/';
  _.forEach(car.skins, function(skin) {
    mkdirp.sync(skinPath + skin);
  });
}

function modifyCarModTyres(car) {
  if (!modTyres) {
    modTyres = {};
  }
  var carTyres = ini.parse(car.mod_tyres);
  if (carTyres[car.name] !== null && carTyres[car.name] !== undefined) {
    modTyres[car.name] = carTyres[car.name];
    saveModTyres();
  }
}

function copyCarFiles(serverCarPath, files) {
  mkdirp.sync(serverCarPath);
  _.forEach(files, function(file) {
    copyFileSync(file.path, serverCarPath + file.originalname);
  });
}

// add new car
module.exports.addNewCar = function(req, res) {
  try {
    var car = {
      name: removeSlashes(req.body.car.name),
      mod_tyres: req.body.car.mod_tyres,
      skins: _.map(req.body.car.skins, removeSlashes)
    };
    var files = _.groupBy(req.files, function(value) {
      return value.fieldname.split('][')[0].substr(4);
    });
    var singleDataFile = false;
    if (files.data.length === 0) {
      throw 'No data files with car';
    } else if (files.data.length === 1) {
      if (files.data[0].originalname !== 'data.acd') {
        throw 'No data.acd file with car';
      }
      singleDataFile = true;
    }
    car.data = files.data;
    
    mkdirCarSkins(car);
    modifyCarModTyres(car);
    var serverCarPath = serverPath + 'content/cars/' + car.name + '/';
    if (singleDataFile) {
      copyCarFiles(serverCarPath, car.data);
    } else {
      copyCarFiles(serverCarPath + 'data/', car.data);
    }
    
    rimraf.sync('./uploads/' + req.uuid);
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get car skin
module.exports.getCarSkin = function(req, res) {
  try {
    var skins = {}
    try {
      var skins = fs.readdirSync(contentPath + '/cars/' + req.params.car + '/skins');
    }
    catch (e) {
    }
    
    res.status(200);
    res.send({ skins: skins });
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// remove existing car
module.exports.removeExistingCar = function(req, res) {
  try {
    var car = removeSlashes(req.params.car);
    var serverCarPath = serverPath + 'content/cars/' + car;
    var contentCarPath = checkLocalContentPath(contentPath) + '/cars/' + car;
    if (modTyres) {
      modTyres = _.omit(modTyres, car);
      saveModTyres();
    }
    rimraf.sync(serverCarPath);
    rimraf.sync(contentCarPath);
    res.status(200);
    res.send('OK');
  }
  catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get entry list
module.exports.getEntryList = function(req, res) {
  try {
    res.status(200);
    res.send(entryList);
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// post entry list
module.exports.postEntryList = function(req, res) {
  try {
    var newEntryList = {};
    
    for (var param in req.body) {
      newEntryList[param.toUpperCase()] = req.body[param];
    }
    entryList = newEntryList;
    saveEntryList();
  }
  catch (e) {
    res.status(500);
    res.send('Application error')
  }
  
  res.status(200);
  res.send('OK');
}

// get drivers
module.exports.getDrivers = function(req, res) {
  try {
    var drivers = [];
    
    jsonfile.readFile(__dirname + '/drivers.json', function (err, data) {
      if (!err) {
        drivers = data;
      }
      
      res.status(200);
      res.send(drivers)
    });
  }
  catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// post drivers
module.exports.postDrivers = function(req, res) {
  try {
    var drivers = [];
    var driver = {};
    for (var param in req.body) {
      driver[param.toUpperCase()] = req.body[param];
    }
    
    jsonfile.readFile(__dirname + '/drivers.json', function (err, data) {
      if (!err) {
        drivers = data;
      }
      
      drivers.push(driver);
      
      jsonfile.writeFile(__dirname + '/drivers.json', drivers, function (err) {
        if (err) {
          console.error(err);
          throw err;
        }
      });
    });
  }
  catch (e) {
    res.status(500);
    res.send('Application error');
  }
  
  res.status(200);
  res.send('OK');
}

// delete driver by guid
module.exports.deleteDriverByGuid = function(req, res) {
  try {
    var guid = req.params.guid;
    if (!guid) {
      throw 'GUID not provided';
    }
    
    jsonfile.readFile(__dirname + '/drivers.json', function (err, data) {
      if (err) {
        throw err;
      }
      
      var found = data.filter(function (item) {
        return item.GUID == guid;
      });
      
      if (found) {
        for (i = 0; i < found.length; i++) {
          data.splice(data.indexOf(found[i]), 1);
        }
        
        jsonfile.writeFile(__dirname + '/drivers.json', data, function (err) {
          if (err) {
            console.error('Error - ' + err);
            throw err;
          }
        });
      }
    });
  }
  catch (e) {
    res.status(500);
    res.send('Application error');
    return;
  }
  
  res.status(200);
  res.send('OK');
}

// get tyres for cars
module.exports.getTyresForCars = function(req, res) {
  try {
    var result = ksTyres;
    if (modTyres) {
      result = extend(ksTyres, modTyres)
    }
    
    if (req.query.cars) {
      var cars = req.query.cars.split(',');
      var filtered = {};
      for (var car in cars) {
        if (result[cars[car]]) {
          filtered[cars[car]] = result[cars[car]];
        }
      }
      result = filtered;
    }
    
    res.status(200);
    res.send(result)
  }
  catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// get acserver status
module.exports.getAcserverStatus = function(req, res) {
  try {
    res.status(200);
    res.send({ status: acServerStatus });
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// start acserver process
module.exports.startAcserverProcess = function(req, res) {
  try {
    var acServer = undefined;
    
    if (isRunningOnWindows) {
      acServer = childProcess.spawn('acServer.exe', { cwd: serverPath });
    } else {
      acServer = childProcess.spawn('./acServer', { cwd: serverPath });
    }
    acServerPid = acServer.pid;
    acServerLogName = getDateTimeString() + '_log.txt';
    
    acServer.stdout.on('data', function (data) {
      if (acServerStatus === 0) {
        acServerStatus = -1;
      }
      
      var dataString = String(data);
      
      if (dataString.indexOf('OK') !== -1 || dataString.indexOf('Server started') !== -1) {
        acServerStatus = 1;
      }
      
      if (dataString.indexOf('stracker has been restarted') !== -1) {
        sTrackerServerStatus = 1
      }
      
      if (dataString.indexOf('PAGE: /ENTRY') === -1) {
        //Log to console and file
        var logEntry = getDateTimeString() + ': ' + data;
        writeLogFile('server_' + acServerLogName, logEntry);
        updateServerLog(logEntry);
        
        //Set current session
        if (dataString.indexOf('session name') !== -1) {
          currentSession = dataString.match(/(SENDING session name : )(Practice|Qualify|Race)/)[2];
        }
      }
    });
    acServer.stderr.on('data', function (data) {
      var logEntry = getDateTimeString() + ': ' + data;
      writeLogFile('error_' + acServerLogName, logEntry);
      updateServerLog(logEntry);
    });
    acServer.on('close', function (code) {
      updateServerLog('Server closed with code: ' + code + '\n');
    });
    acServer.on('exit', function (code) {
      updateServerLog('Server exited with code: ' + code + '\n');
      acServerStatus = 0;
    });
    
    return true;
  } catch (e) {
    return false;
  }
}

// post stop ac server
module.exports.postStopAcServer = function() {
  try {
    if (acServerPid) {
      if (isRunningOnWindows) {
        childProcess.spawn('taskkill', ['/pid', acServerPid, '/f', '/t']);
      } else {
        childProcess.spawn('kill', [acServerPid]);
      }
      
      acServerPid = undefined;
      acServerLogName = undefined;
      currentSession = 'stopped'
    }
    
    return true
  } catch (e) {
    return false
  }
}

// get stracker server status
module.exports.getStrackerServerStatus = function(req, res) {
  try {
    res.status(200);
    res.send({ status: sTrackerPath === '' ? -2 : sTrackerServerStatus });
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// post start stracker server
module.exports.postStartStrackerServer = function(req, res) {
  try {
    var sTracker = undefined;
    
    if (isRunningOnWindows) {
      sTracker = childProcess.spawn('stracker.exe', ['--stracker_ini', 'stracker.ini'], { cwd: sTrackerPath });
    } else {
      sTracker = childProcess.spawn('./stracker_linux_x86/stracker', ['--stracker_ini', 'stracker.ini'], { cwd: sTrackerPath });
    }
    sTrackerServerPid = sTracker.pid;
    
    if (sTrackerServerStatus == 0) {
      sTrackerServerStatus = -1;
    }
    
    sTracker.stdout.on('data', function (data) {
    });
    sTracker.stderr.on('data', function (data) {
    });
    sTracker.on('close', function (code) {
    });
    sTracker.on('exit', function (code) {
      sTrackerServerStatus = 0;
    });
    
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// post stop stracker server
module.exports.postStopStrackerServer = function(req, res) {
  try {
    if (sTrackerServerPid) {
      if (isRunningOnWindows) {
        childProcess.spawn('taskkill', ['/pid', sTrackerServerPid, '/f', '/t']);
      } else {
        childProcess.spawn('kill', [sTrackerServerPid]);
      }
      sTrackerServerPid = undefined;
    }
    
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}

// list templates
module.exports.listTemplates = function() {
  try {
    var templateUuids = fs.readdirSync(contentPath + '/templates');
    var templates = [];
    
    for (var idx in templateUuids) {
      var uuid = templateUuids[idx];
      var templateFile = contentPath + '/templates/' + uuid + '/config.json';
      var template = jsonfile.readFileSync(templateFile)
      template.uuid = uuid;
      templates.push(template);
    }
    
    
    return templates;
  } catch (e) {
    return [];
  }
}

// store current configuration to a new template
module.exports.storeCurrentConfigurationToANewTemplate = function(template) {
  try {
    template.uuid = uuidv4();
    if (template.name === '') {
      throw 'Template must have a name!';
    }
    
    var templateDir = contentPath + '/templates/' + template.uuid;
    // TODO: assert existence and generate new uuidv4?
    
    fs.mkdirSync(templateDir);
    copyFileSync(serverPath + 'cfg/server_cfg.ini', templateDir + '/server_cfg.ini');
    copyFileSync(serverPath + 'cfg/entry_list.ini', templateDir + '/entry_list.ini');
    jsonfile.writeFileSync(templateDir + '/config.json', template);
    
    return template
  } catch (e) {
    return false
  }
}

// apply templated configuration
module.exports.applyTemplatedConfiguration = function(uuid) {
  try {
    if (!uuid) {
      throw 'UUID not provided';
    }
    
    var templateDir = contentPath + '/templates/' + uuid;
    var templateFile = contentPath + '/templates/' + uuid + '/config.json';
    var template = jsonfile.readFileSync(templateFile)
    config =  multiLine.read(templateDir + '/server_cfg.ini', {encoding: 'utf8'});
    entryList =  multiLine.read(templateDir + '/entry_list.ini', {encoding: 'utf8'});
    saveConfig();
    saveEntryList();
    
    return template
  } catch (e) {
    return false;
  }
}

// delete template based on uuid
module.exports.deleteTemplateBasedOnUuid = function(uuid) {
  try {
    if (!uuid) {
      throw 'UUID not provided';
    }
    
    var templateDir = contentPath + '/templates/' + uuid;
    rimraf.sync(templateDir);
    
    res.status(200);
    res.send('OK');
  } catch (e) {
    res.status(500);
    res.send('Application error');
  }
}
