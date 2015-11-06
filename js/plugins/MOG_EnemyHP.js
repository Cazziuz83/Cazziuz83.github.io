//=============================================================================
// MOG_EnemyHP.js
//=============================================================================

/*:
 * @plugindesc (v1.0) Apresenta o HP do inimigo ao ataca-lo.
 * @author Moghunter
 *
 * @param EHP Fade Duration
 * @desc Definição do tempo para ativar o fade.
 * (Default = 120) 
 * @default 120
 *
 * @param EHP Layout X-Axis
 * @desc Posição X-Axis do layout.
 * @default 0
 *
 * @param EHP Layout Y-Axis
 * @desc Posição Y-Axis do layout.
 * @default 0
 *
 * @param EHP Meter X-Axis
 * @desc Posição X-Axis do medidor.
 * @default 4
 *
 * @param EHP Meter Y-Axis
 * @desc Posição Y-Axis do medidor.
 * @default 2 
 + 
 * @help  
 * =============================================================================
 * +++ MOG - Enemy HP Meter (v1.0) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * =============================================================================
 * Apresenta o HP do inimigo ao ataca-lo.
 * Serão necessários os arquivos. (img/system/)
 *
 * EnemyHP_A.png
 * EnemyHP_B.png
 * 
 * Para ocultar o HP do inimigo use a seguinte Tag na caixa de notas
 *
 * <hide hp>
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_EnemyHP = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_EnemyHP');
    Moghunter.enemyhp_a_x = Number(Moghunter.parameters['EHP Layout X-Axis'] || 0);
    Moghunter.enemyhp_a_y = Number(Moghunter.parameters['EHP Layout Y-Axis'] || 0);
    Moghunter.enemyhp_b_x = Number(Moghunter.parameters['EHP Meter X-Axis'] || 4);
    Moghunter.enemyhp_b_y = Number(Moghunter.parameters['EHP Meter Y-Axis'] || 2);	
    Moghunter.enemyhp_duration = Number(Moghunter.parameters['EHP Fade Duration'] || 120);
	
//=============================================================================
// ** Sprite_Enemy
//=============================================================================	

//==============================
// * CreateLowerLayer
//==============================
var _alias_mog_enemyhp_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer
Spriteset_Battle.prototype.createLowerLayer = function() {
	_alias_mog_enemyhp_createLowerLayer.call(this);
	this.create_ehp_sprites();
}

//==============================
// * Update
//==============================
var _alias_mog_enemyhp_update = Spriteset_Battle.prototype.update
Spriteset_Battle.prototype.update = function() {
	_alias_mog_enemyhp_update.call(this);
	this.update_ehp_sprites();
}

//==============================
// * Create EHP Sprites
//==============================
Spriteset_Battle.prototype.create_ehp_sprites = function() {
	this._ehp_sprites_a = [];
	this._ehp_sprites_b = [];
	this._ehp_sprites_c = [];
	this._ehp_sprites_data = [];
    for (var i = 0; i < this._enemySprites.length; i++) {
		var notetag = $dataEnemies[this._enemySprites[i]._enemy._enemyId].note.split(/[\r\n]+/);
        this._ehp_sprites_a[i] = new Sprite(ImageManager.loadSystem("EnemyHP_A"));
		this._ehp_sprites_b[i] = new Sprite(ImageManager.loadSystem("EnemyHP_B"));
		this._ehp_sprites_c[i] = new Sprite(ImageManager.loadSystem("EnemyHP_B"));
        this._ehp_sprites_a[i].opacity = 0;
		this._ehp_sprites_b[i].opacity = 0;
		this._ehp_sprites_c[i].opacity = 0;
		for (var n = 0; n < notetag.length; n++) {
			if (notetag[n] == "<hide hp>") {this._ehp_sprites_a[i].visible = false};
		}			
		this._ehp_sprites_b[i].visible = this._ehp_sprites_a[i].visible
		this._ehp_sprites_c[i].visible = this._ehp_sprites_a[i].visible
		this.addChild(this._ehp_sprites_a[i]);
		this.addChild(this._ehp_sprites_b[i]);	
		this.addChild(this._ehp_sprites_c[i]);	
		this._ehp_sprites_data[i] = [this._enemySprites[i]._enemy.hp,0,0,Math.max(Moghunter.enemyhp_duration,32),this._enemySprites[i]._enemy.hp,];
    };
};

//==============================
// * Update EHP Sprites
//==============================
Spriteset_Battle.prototype.update_ehp_sprites = function() {
	for (var i = 0; i < this._enemySprites.length; i++) {
		if (!this._ehp_sprites_a[i].bitmap.isReady()) {return};
		this._ehp_sprites_a[i].x = this._enemySprites[i].x + Moghunter.enemyhp_a_x +this._ehp_sprites_data[i][1] - (this._ehp_sprites_a[i].bitmap.width / 2);
		this._ehp_sprites_a[i].y = this._enemySprites[i].y + Moghunter.enemyhp_a_y;
		this._ehp_sprites_b[i].x = this._ehp_sprites_a[i].x + Moghunter.enemyhp_b_x;
		this._ehp_sprites_b[i].y = this._ehp_sprites_a[i].y + Moghunter.enemyhp_b_y;
		this._ehp_sprites_c[i].x = this._ehp_sprites_a[i].x + Moghunter.enemyhp_b_x;
		this._ehp_sprites_c[i].y = this._ehp_sprites_a[i].y + Moghunter.enemyhp_b_y;		
		this._ehp_sprites_b[i].opacity = this._ehp_sprites_a[i].opacity;
		this._ehp_sprites_c[i].opacity = this._ehp_sprites_a[i].opacity;
		this.update_ehp_red_bar(i);
		this.update_ehp_blue_bar(i)	;
    };
};

//==============================
// * Update EHP Blue Bar
//==============================
Spriteset_Battle.prototype.update_ehp_blue_bar = function(i) {
		if (this._enemySprites[i]._enemy.hp == 0) {this._ehp_sprites_a[i].opacity -= 2};
		if (this._ehp_sprites_data[i][2] > 0) {this._ehp_sprites_data[i][2] -= 1};  
		if (this._ehp_sprites_data[i][2] > this._ehp_sprites_data[i][3])
		   {this._ehp_sprites_data[i][1] += 2; this._ehp_sprites_a[i].opacity += 17;}
		else
		   {if (this._ehp_sprites_data[i][1] < 30 && this._ehp_sprites_data[i][2] <= 15) 
		        {this._ehp_sprites_data[i][1] += 2;this._ehp_sprites_a[i].opacity -= 17;}
		}		
		if (this._ehp_sprites_data[i][0] != this._enemySprites[i]._enemy.hp) 
		    {if (this._ehp_sprites_data[i][2] > 15 && this._ehp_sprites_data[i][2] <= this._ehp_sprites_data[i][3])
				{this._ehp_sprites_data[i][2] = this._ehp_sprites_data[i][3];}
		else {this._ehp_sprites_data[i][1] = -30;this._ehp_sprites_data[i][2] = this._ehp_sprites_data[i][3] + 15;}
		}
		this._ehp_sprites_data[i][0] = this._enemySprites[i]._enemy.hp;	     	
		var meter_rate = this._ehp_sprites_c[i].bitmap.width * this._enemySprites[i]._enemy.hp / this._enemySprites[i]._enemy.mhp;
	    this._ehp_sprites_c[i].setFrame(0, 0, meter_rate, this._ehp_sprites_c[i].bitmap.height / 2);
};

//==============================
// * Update EHP Red Bar
//==============================
Spriteset_Battle.prototype.update_ehp_red_bar = function(i) {
		if (this._ehp_sprites_data[i][4] != this._enemySprites[i]._enemy.hp) {
					var dnspeed = 1 + (Math.abs(this._ehp_sprites_data[i][4] - this._enemySprites[i]._enemy.hp) / 240);
			if (this._ehp_sprites_data[i][4] > this._enemySprites[i]._enemy.hp) {
			    this._ehp_sprites_data[i][4] -= dnspeed;
				if (this._ehp_sprites_data[i][4] < this._enemySprites[i]._enemy.hp ) {
		    		this._ehp_sprites_data[i][4] = this._enemySprites[i]._enemy.hp};
			}
			else if (this._ehp_sprites_data[i][4] < this._enemySprites[i]._enemy.hp) {
			    this._ehp_sprites_data[i][4] += dnspeed;
				if (this._ehp_sprites_data[i][4] > this._enemySprites[i]._enemy.hp ) {
		    		this._ehp_sprites_data[i][4] = this._enemySprites[i]._enemy.hp};			
			}
			var meter_rate = this._ehp_sprites_b[i].bitmap.width * this._ehp_sprites_data[i][4] / this._enemySprites[i]._enemy.mhp;
	     	this._ehp_sprites_b[i].setFrame(0, this._ehp_sprites_b[i].bitmap.height / 2, meter_rate, this._ehp_sprites_b[i].bitmap.height / 2);
	    };	
};