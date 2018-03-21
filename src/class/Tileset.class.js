let currentGameFrame = 1;

export default class{
	constructor(ctx, imgUrl, data, animSpeed){
    this.image = new Image();

    this.image.src = imgUrl;

		this.data = data;

		this.ctx = ctx;

		this.animSpeed = animSpeed;

		this.currentTile = 1;

		this.currentAnimation = null;
  }

	drawTile(tile, ctx, x, y, scale = {}){
		if (!scale.x) scale.x = 1;
    if (!scale.y) scale.y = 1;

		ctx.save();
		ctx.scale(scale.x, scale.y);
		ctx.drawImage(this.image, tile.x, tile.y, tile.width, tile.height, x / scale.x,  y / scale.y,
					 tile.width * scale.x, tile.height* scale.y);
	 	ctx.restore();
	}

	getTileByName (name) {
		return this.data.filter(item => item.name == name)[0];
	}

	nextAnimationTile (name) {
		let tile =  this.currentTile + 1;
		if (!this.getTileByName(name+tile)) {
			return null;
		}
		return this.getTileByName(name+tile);
	}

	prevAnimationTile (name) {
		let prevTile =  this.currentTile - 1;
		if (!this.getTileByName(name+prevTile)) {
			return null;
		}
		return this.getTileByName(name+prevTile);
	}

	currentAnimationTile (name) {
		if (!this.getTileByName(name+this.currentTile)) {
			return null;
		}
		return this.getTileByName(name+this.currentTile);
	}

	play(name, x, y, scale, loop = false){
		if (this.currentAnimation != name) {
			this.currentAnimation = name;
			this.currentTile = 1;
			this.currentGameFrame = 1;
		}

		let tile = this.currentAnimationTile(name);
		if(!(currentGameFrame%this.animSpeed)) {
			tile = this.nextAnimationTile(name)
			this.currentTile++;
		};

		if (!tile) {
			if (loop) {
				this.currentTile = 1;
				tile = this.getTileByName(name+1);
			} else {
				tile = this.prevAnimationTile(name);
				this.currentTile--;
			}
		}

		this.drawTile(tile, this.ctx, x, y, scale);
		currentGameFrame++;
	}
}
