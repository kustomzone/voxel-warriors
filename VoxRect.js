var Node = {
	childprocessHandle: null,
	
	cryptoHandle: null,
	
	fsHandle: null,
	
	httpHandle: null,
	
	pathHandle: null,
	
	init: function() {
		Node.childprocessHandle = require('child_process');
		
		Node.cryptoHandle = require('crypto');
		
		Node.fsHandle = require('fs');

		Node.httpHandle = require('http');

		Node.pathHandle = require('path');
	},
	
	dispel: function() {
		Node.childprocessHandle = null;
		
		Node.cryptoHandle = null;
		
		Node.fsHandle = null;
		
		Node.httpHandle = null;
		
		Node.pathHandle = null;
	}
};

{
	Node.init();
}

{
	with (global) {
		eval(Node.fsHandle.readFileSync(__dirname + '/NodeGen.config').toString());
		
		eval(Node.fsHandle.readFileSync(__dirname + '/NodeGen.js').toString());
	}
}

{
	with (global) {
		eval(Node.fsHandle.readFileSync(__dirname + '/VoxRect.config').toString());
	}
}

{
	Express.serverHandle.get('/', function(requestHandle, responseHandle) {
		responseHandle.status(302);
		
		responseHandle.set({
			'Location': '/index.html'
		});
		
		responseHandle.end();
	});
	
	Express.serverHandle.get('/index.html', function(requestHandle, responseHandle) {
		var Mustache_objectHandle = {
			'objectMain': {
				'strRandom': ''
			},
			'objectGameserver': {
				strName: '',
				strLoginPassword: '',
				intLoginPassword: 0,
				strLoginMotd: '',
				intPlayerActive: 0,
				intPlayerCapacity: 0,
				strPlayerSkin: [],
				strMapActive: '',
				strMapAvailable: []
			}
		};
		
		{
			var hashHande = Node.cryptoHandle.createHash('sha512');
			
			{
				hashHande.update(Node.cryptoHandle.randomBytes(256));
			}
			
			var strBase = hashHande.digest('base64');
			
			{
				strBase = strBase.replace(new RegExp('\\+', 'g'), '');
				strBase = strBase.replace(new RegExp('\\/', 'g'), '');
			}
			
			Mustache_objectHandle.objectMain.strRandom = strBase.substr(0, 32);
		}
		
		{
			Mustache_objectHandle.objectGameserver.strName = Gameserver.strName;
			Mustache_objectHandle.objectGameserver.strLoginPassword = Gameserver.strLoginPassword;
			Mustache_objectHandle.objectGameserver.intLoginPassword = Gameserver.intLoginPassword;
			Mustache_objectHandle.objectGameserver.strLoginMotd = Gameserver.strLoginMotd;
			Mustache_objectHandle.objectGameserver.intPlayerActive = Gameserver.intPlayerActive;
			Mustache_objectHandle.objectGameserver.intPlayerCapacity = Gameserver.intPlayerCapacity;
			Mustache_objectHandle.objectGameserver.strPlayerSkin = Gameserver.strPlayerSkin;
			Mustache_objectHandle.objectGameserver.strMapActive = Gameserver.strMapActive;
			Mustache_objectHandle.objectGameserver.strMapAvailable = Gameserver.strMapAvailable;
		}
		
		var FilesystemRead_bufferHandle = null;
		
		var functionFilesystemRead = function() {
			Node.fsHandle.readFile(__dirname + '/assets/index.html', function(errorHandle, bufferHandle) {
				if (errorHandle !== null) {
					responseHandle.end();
					
					return;
				}
				
				{
					FilesystemRead_bufferHandle = bufferHandle;
				}
				
				functionSuccess();
			});
		};
		
		var functionSuccess = function() {
			var strData = FilesystemRead_bufferHandle.toString();

			{
				strData = Mustache.mustacheHandle.render(strData, Mustache_objectHandle);
				
				strData = Mustache.mustacheHandle.render(strData, Mustache_objectHandle);
			}
			
			{
				strData = Hypertextminfier.hypertextminfierHandle.minify(strData, {
					'removeComments': true,
					'removeCommentsFromCDATA': true,
					'removeCDATASectionsFromCDATA': false,
					'collapseWhitespace': true,
					'conservativeCollapse': true,
					'collapseBooleanAttributes': false,
					'removeAttributeQuotes': false,
					'removeRedundantAttributes': false,
					'useShortDoctype': false,
					'removeEmptyAttributes': false,
					'removeOptionalTags': false,
					'removeEmptyElements': false
				});
			}
			
			responseHandle.status(200);
			
			responseHandle.set({
				'Content-Length': Buffer.byteLength(strData, 'utf-8'),
				'Content-Type': Mime.mimeHandle.lookup('html'),
				'Content-Disposition': 'inline; filename="' + requestHandle.path.substr(requestHandle.path.lastIndexOf('/') + 1) + '";'
			});
			
			responseHandle.write(strData);
			
			responseHandle.end();
		};
		
		functionFilesystemRead();
	});
	
	Express.serverHandle.use('/', Express.expressHandle.static(__dirname + '/assets'));
}

{
	Socket.serverHandle.on('connection', function(socketHandle) {
		{
			var strSocket = '';
			
			{
				strSocket = socketHandle.id.substr(1, 8);
			}
			
			Gameserver.objectPlayer[socketHandle.id] = {
				'strSocket': strSocket,
				'strTeam': 'teamLogin',
				'strName': '',
				'strSkin': '',
				'dblPositionX': 0.0,
				'dblPositionY': 0.0,
				'dblPositionZ': 0.0,
				'dblVerletX': 0.0,
				'dblVerletY': 0.0,
				'dblVerletZ': 0.0
			};
		}
		
		{
			socketHandle.emit('loginHandle', {
				'strType': 'typeReject',
				'strMessage': ''
			});
		}
		
		socketHandle.on('loginHandle', function(jsonHandle) {
			if (jsonHandle.strName === undefined) {
				return;
				
			} else if (jsonHandle.strPassword === undefined) {
				return;
				
			} else if (jsonHandle.strSkin === undefined) {
				return;
				
			}

			if (Gameserver.objectPlayer[socketHandle.id].strTeam !== 'teamLogin') {
				return;
			}
			
			{
				if (Gameserver.intPlayerActive === Gameserver.intPlayerCapacity) {
					socketHandle.emit('loginHandle', {
						'strType': 'typeReject',
						'strMessage': 'server full'
					});
					
					return;
					
				} else if (jsonHandle.strName === '') {
					socketHandle.emit('loginHandle', {
						'strType': 'typeReject',
						'strMessage': 'name invalid'
					});
					
					return;
					
				} else if (jsonHandle.strPassword !== Gameserver.strLoginPassword) {
					socketHandle.emit('loginHandle', {
						'strType': 'typeReject',
						'strMessage': 'password wrong'
					});
					
					return;
					
				} else if (Gameserver.strPlayerSkin.indexOf(jsonHandle.strSkin) === -1) {
					socketHandle.emit('loginHandle', {
						'strType': 'typeReject',
						'strMessage': 'skin invalid'
					});
					
					return;
					
				}
			}
			
			{
				// TODO: assign team
				
				socketHandle.emit('loginHandle', {
					'strType': 'typeAccept',
					'strMessage': ''
				});
			}
		});
		
		socketHandle.on('chatHandle', function(jsonHandle) {
			if (jsonHandle.strMessage === undefined) {
				return;
			}
			
			if (Gameserver.objectPlayer[socketHandle.id].strStatus === 'teamLogin') {
				return;
				
			} else if (jsonHandle.strMessage === '') {
				return;
				
			}
			
			{
				var strMessage = jsonHandle.strMessage;
				
				{
					if (strMessage.length > 140) {
						strMessage = strMessage.substr(1, 140) + ' ' + '...';
					}
				}
				
				jsonHandle.strMessage = strMessage;
			}
			
			{
				Socket.serverHandle.emit('chatHandle', {
					'strName': Gameserver.objectPlayer[socketHandle.id].strName,
					'strMessage': jsonHandle.strMessage
				});
			}
		});
		
		socketHandle.on('disconnect', function() {
			
		});
	});
}

var Gameserver = {
	strName: '',
	strLoginPassword: '',
	intLoginPassword: 0,
	strLoginMotd: '',
	intPlayerActive: 0,
	intPlayerCapacity: 0,
	strPlayerSkin: [],
	strMapActive: '',
	strMapAvailable: [],
	
	objectPlayer: {},
	
	init: function() {
		Gameserver.strName = process.env.strName;
		Gameserver.strLoginPassword = process.env.strLoginPassword;
		Gameserver.intLoginPassword = 0;
		Gameserver.strLoginMotd = process.env.strLoginMotd;
		Gameserver.intPlayerCapacity = process.env.intPlayerCapacity;
		Gameserver.intPlayerActive = 0;
		Gameserver.strPlayerSkin = [];
		Gameserver.strMapActive = '';
		Gameserver.strMapAvailable = [];
		
		Gameserver.objectPlayer = {};

		{
			if (process.env.strLoginPassword === '') {
				Gameserver.intLoginPassword = 0;
				
			} else if (process.env.strLoginPassword !== '') {
				Gameserver.intLoginPassword = 1;
				
			}
		}

		{
			var dirHandle = Node.fsHandle.readdirSync(__dirname + '/assets/skins');
			
			for (var intFor1 = 0; intFor1 < dirHandle.length; intFor1 += 1) {
				var strSkin = dirHandle[intFor1];
				
				{
					strSkin = strSkin.replace(new RegExp('\\.png', 'g'), '');
				}
				
				{
					Gameserver.strPlayerSkin.push(strSkin);
				}
			}
		}

		{
			var dirHandle = Node.fsHandle.readdirSync(__dirname + '/assets/maps');
			
			for (var intFor1 = 0; intFor1 < dirHandle.length; intFor1 += 1) {
				var strMap = dirHandle[intFor1];
				
				{
					strMap = strMap.replace(new RegExp('\\.json', 'g'), '');
				}
				
				{
					Gameserver.strMapAvailable.push(strMap);
				}
			}
		}
	},
	
	dispel: function() {
		Gameserver.strName = '';
		Gameserver.strLoginPassword = '';
		Gameserver.intLoginPassword = 0;
		Gameserver.strLoginMotd = '';
		Gameserver.intPlayerCapacity = 0
		Gameserver.intPlayerActive = 0;
		Gameserver.strPlayerSkin = [];
		Gameserver.strMapActive = '';
		Gameserver.strMapAvailable = [];
		
		Gameserver.objectPlayer = {};
	}
};

{
	Gameserver.init();
}

//TODO: insert domain / start immediately
setInterval(function () {
	var functionRequest = function() {
		var requestHttp = Node.httpHandle.request({
			'host': '127.0.0.1',
			'port': 26866,
			'path': '/host.xml?intPort=' + encodeURIComponent(process.env.intSocketPort) + '&strName=' + encodeURIComponent(Gameserver.strName) + '&intLoginPassword=' + encodeURIComponent(Gameserver.intLoginPassword) + '&intPlayerCapacity=' + encodeURIComponent(Gameserver.intPlayerCapacity) + '&intPlayerActive=' + encodeURIComponent(Gameserver.intPlayerActive) + '&strMapActive=' + encodeURIComponent(Gameserver.strMapActive),
			'method': 'GET'
		}, function(responseHttp) {
			var strContent = '';
			
			responseHttp.setEncoding('UTF-8');
			
			responseHttp.on('data', function(strData) {
				strContent += strData;
			});
			
			responseHttp.on('end', function() {
				functionSuccess();
			});
		});
		
		requestHttp.on('error', function(errorHandle) {
			console.log(errorHandle);
			functionError();
		});
		
		requestHttp.end();
	};
	
	var Errorsuccess_intTimestamp = new Date().getTime();
	
	var functionError = function() {
		var dateHandle = new Date();

		console.log('');
		console.log('------------------------------------------------------------');
		console.log('- Timestamp: ' + dateHandle.toISOString());
		console.log('- Origin: VoxRect');
		console.log('- Duration: ' + (dateHandle.getTime() - Errorsuccess_intTimestamp));
		console.log('- Status: Error');
		console.log('------------------------------------------------------------');
	};
	
	var functionSuccess = function() {
		var dateHandle = new Date();

		console.log('');
		console.log('------------------------------------------------------------');
		console.log('- Timestamp: ' + dateHandle.toISOString());
		console.log('- Origin: VoxRect');
		console.log('- Duration: ' + (dateHandle.getTime() - Errorsuccess_intTimestamp));
		console.log('- Status: Success');
		console.log('------------------------------------------------------------');
	};
	
	functionRequest();
}, 5 * 60 * 1000);