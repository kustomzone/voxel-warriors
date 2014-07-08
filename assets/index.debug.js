jQuery(document).ready(function() {
	{
		jQuery('#idLoading')
			.dialog({
				'autoOpen': true,
				'closeOnEscape': false,
				'height': 'auto',
				'minHeight': 0,
				'minWidth': 0,
				'modal': true,
				'resizable': false,
				'width': 'auto',
				'create': function() {
					{
						jQuery(this).closest('.ui-dialog')
							.css({
								'border': 'none',
								'background': 'none'
							})
						;
						
						jQuery(this).closest('.ui-dialog').find('.ui-dialog-titlebar')
							.css({
								'display': 'none'
							})
						;
					}
					
					{
						jQuery(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close')
							.hide()
						;
					}
				}
			})
		;
	}
	
	{
		jQuery('#idLogin')
			.dialog({
				'autoOpen': false,
				'closeOnEscape': false,
				'height': 'auto',
				'minHeight': 0,
				'minWidth': 0,
				'modal': true,
				'resizable': false,
				'width': 422,
				'create': function() {
					{
						jQuery(this).closest('.ui-dialog').find('.ui-dialog-titlebar')
							.css({
								'line-height': '125%'
							})
						;
						
						jQuery(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close')
							.hide()
						;
					}
				}
			})
		;
	}

	{
		jQuery('#idLogin_Team').find('option').eq(Math.round(Math.random()))
		    .prop({
		        'selected': true
		    })
		;
		
		jQuery('#idLogin_Team')
			.selectmenu({
				'disabled': false,
				'width': 300
			})
		;
		
		jQuery('#idLogin_Team').closest('.ui-dialog').find('.ui-selectmenu-button')
			.css({
				'background': 'none'
			})
		;
	}
	
	{
		jQuery('#idLogin_Login')
			.button({
				'disabled': false,
				'icons': {
					'primary': 'ui-icon-check'
				}
			})
			.off('click')
			.on('click', function() {
				{
					jQuery('#idLogin')
						.dialog('close')
					;
					
					jQuery('#idLoading')
						.dialog('open')
					;
				}
				
				{
					Socket.socketHandle.emit('loginHandle', {
						'strName': jQuery('#idLogin_Name').val(),
						'strPassword': jQuery('#idLogin_Password').val(),
						'strTeam': jQuery('#idLogin_Team').val()
					});
				}
			});
		;
	}
	
	{
		jQuery('#idMenu')
			.dialog({
				'autoOpen': false,
				'closeOnEscape': false,
				'height': 'auto',
				'minHeight': 0,
				'minWidth': 0,
				'modal': false,
				'resizable': false,
				'width': 640,
				'create': function() {
					{
						jQuery(this).closest('.ui-dialog').find('.ui-dialog-titlebar')
							.css({
								'line-height': '125%'
							})
						;
						
						jQuery(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close')
							.hide()
						;
					}
				}
			})
		;
	}

	{
		Socket.init();
	}
});

var Socket = {
	socketHandle: null,

	playerHandle: {},
	
	init: function() {
		Socket.socketHandle = null;
		
		Socket.playerHandle = {};
		
		{
			jQuery.getScript('/socket.io/socket.io.js', function() {
				Socket.socketHandle = io('/', {
					'reconnection': true,
					'reconnectionDelay': 1000,
					'reconnectionDelayMax': 5000,
					'timeout': 5000
				});

				Socket.socketHandle.on('loginHandle', function(jsonHandle) {
					console.log('loginHandle');
					console.log(jsonHandle);
					
					{
						if (jsonHandle.strType === 'typeReject') {
							{
								jQuery('#idLoading')
									.dialog('close')
								;
								
								jQuery('#idLogin')
									.dialog('open')
								;
							}
							
							{
								jQuery('#idLogin_Message')
									.text(jsonHandle.strMessage)
								;
							}
							
							{
								if (jsonHandle.strMessage === '') {
									jQuery('#idLogin').children().slice(0, 3)
										.css({
											'display': 'none'
										})
									;
									
								} else if (jsonHandle.strMessage !== '') {
									jQuery('#idLogin').children().slice(0, 3)
										.css({
											'display': 'block'
										})
									;
									
								}
							}
							
						} else if (jsonHandle.strType === 'typeAccept') {
							{
								jQuery('#idLoading')
									.dialog('close')
								;

								// TODO
							}
							
						}
					}
				});
				
				Socket.socketHandle.on('onlineHandle', function(jsonHandle) {
					console.log('onlineHandle');
					console.log(jsonHandle);
					
					{
						jQuery('#idServer_Players')
							.val(jsonHandle.serverHandle.intPlayerActive + ' / ' + jsonHandle.serverHandle.intPlayerCapacity)
						;
						
						jQuery('#idServer_Map')
							.val(jsonHandle.serverHandle.strMapActive)
						;
					}
					
					{
						jQuery('#idTeamRed_Table').find('tr').slice(1)
							.remove()
						;

						jQuery('#idTeamBlue_Table').find('tr').slice(1)
							.remove()
						;
					}
					
					{
						for (var intFor1 = 0; intFor1 < jsonHandle.playerHandle.length; intFor1 += 1) {
							var playerHandle = jsonHandle.playerHandle[intFor1];
							
							{
								if (playerHandle.strTeam === 'teamRed') {
									jQuery('#idTeamRed_Table')
										.append(jQuery('<tr></tr>')
											.append(jQuery('<td></td>')
												.text(playerHandle.strName)
											)
											.append(jQuery('<td></td>')
												.text(playerHandle.intScore)
											)
											.append(jQuery('<td></td>')
												.text(playerHandle.intKills)
											)
											.append(jQuery('<td></td>')
												.text(playerHandle.intDeaths)
											)
										)
									;
									
								} else if (playerHandle.strTeam === 'teamBlue') {
									jQuery('#idTeamBlue_Table')
										.append(jQuery('<tr></tr>')
											.append(jQuery('<td></td>')
												.text(playerHandle.strName)
											)
											.append(jQuery('<td></td>')
												.text(playerHandle.intScore)
											)
											.append(jQuery('<td></td>')
												.text(playerHandle.intKills)
											)
											.append(jQuery('<td></td>')
												.text(playerHandle.intDeaths)
											)
										)
									;
									
								}	
							}
						}
					}
					
					{
						jQuery('#idTeamRed_Players')
							.val(jQuery('#idTeamRed_Table').find('tr').size() - 1)
						;
						
						jQuery('#idTeamBlue_Players')
							.val(jQuery('#idTeamBlue_Table').find('tr').size() - 1)
						;
						
						jQuery('#idTeamRed_Score')
							.val(jsonHandle.serverHandle.intScoreRed)
						;
						
						jQuery('#idTeamBlue_Score')
							.val(jsonHandle.serverHandle.intScoreBlue)
						;
					}
				});
				
				Socket.socketHandle.on('chatHandle', function(jsonHandle) {
					console.log('chatHandle');
					console.log(jsonHandle);

				});
			});
		}
	},
	
	dispel: function() {
		Socket.socketHandle = null;
		
		Socket.playerHandle = {};
	}
};

var Voxel = {
	voxelengineHandle: null,

	voxelplayerHandle: null,

	voxelhighlightHandle: null,
	
	init: function() {
		Voxel.voxelengineHandle = require('voxel-engine')({
			'texturePath': './textures/',
			'generate': function(x, y, z) {
					return y === -10 ? 1 : 0;
			},
			'controls': {
				'discreteFire': true
			},
			'statsDisabled': true
		});
		
		Voxel.voxelplayerHandle = require('voxel-player')(Voxel.voxelengineHandle);
		
		Voxel.voxelhighlightHandle = require('voxel-highlight')(Voxel.voxelengineHandle);

		{
			Voxel.voxelengineHandle.appendTo(jQuery('#idVoxel').get(0));
		}
		
		{
			var self = Voxel.voxelplayerHandle('./skins/logan.png');
			
			self.yaw.position.set(2, 14, 4);
			
			self.possess();
		}
	},
	
	dispel: function() {
		Voxel.voxelengineHandle = null;
		
		Voxel.voxelplayerHandle = null;
		
		Voxel.voxelhighlightHandle = null;
	}
};