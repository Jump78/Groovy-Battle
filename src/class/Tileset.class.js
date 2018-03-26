let totalFramePlayed = 1; // Total frame player since the animation stat

/**
 * Allowed us to use Tileset and his animation
 * @type {Tileset}
 */
export default class{
	constructor(ctx, imgUrl, data, animSpeed){
    this.image = new Image();

    this.image.src = imgUrl;

		this.data = data;

		this.ctx = ctx;

		this.animSpeed = animSpeed;

		this.currentTileNumber = 1;

		this.currentAnimation = null;
  }

	/**
	 * Draw the tile in the context
	 * @param  {object} tile       The tile to draw
	 * @param  {int} 		x          X value
	 * @param  {int} 		y          Y value
	 * @param  {object} [scale={}] Scale object contain scale info for X and Y axis
	 * @param  {int} [offset=0] 	 Offset of the Y axis
	 * @return {undefined}         Nothing
	 */
	drawTile(tile, x, y, scale = {}, offset = {x:0, y:0}){
		if (!scale.x) scale.x = 1;
		if (!scale.y) scale.y = 1;

		let widthFactor = (scale.x > 0)? 1 : -1;
		let heightFactor = (scale.y > 0)? 1 : -1;

		y += offset.y * scale.y;
		x += offset.x * scale.x;

		this.ctx.save();
		this.ctx.translate(x, y);
		this.ctx.scale(scale.x, scale.y);
		this.ctx.drawImage(this.image, tile.x, tile.y, tile.width, tile.height,
		 									0, 0,tile.width * widthFactor, tile.height * heightFactor);
		 this.ctx.restore();
	}

	/**
	 * Return the name with the name passed in arg
	 * @param  {string} name Tile's name
	 * @return {tile}      	 The tile
	 */
	getTileByName (name) {
		return this.data.filter(item => item.name == name)[0];
	}

	/**
	 * Return all tiles of the animation
	 * @param  {string} name Animation's name
	 * @return {array}       Array of tile
	 */
	getAllTileByAnimName (name) {
		return this.data.filter(item => item.name.includes(name));
	}

	/**
	 * Return the highest tile
	 * @return {tile}    The highest tile
	 */
	getMaxTile () {
		return this.data.sort((a, b) => b.height - a.height)[0];
	}

	/**
	 * Return the highest tile
	 * @return {tile}    The highest tile
	 */
	getMaxTileW () {
		return this.data.sort((a, b) => b.width - a.width)[0];
	}

	/**
	 * Return the next tile of the animation
	 * @param  {string} name Animation name
	 * @return {tile}      	 The next tile
	 */
	nextAnimationTile (name) {
		let tile =  this.currentTileNumber + 1;
		if (!this.getTileByName(name+tile)) {
			return null;
		}
		return this.getTileByName(name+tile);
	}

	/**
	 * Return the prev tile of the animation
	 * @param  {string} name Animation name
	 * @return {tile}      	The prev title
	 */
	prevAnimationTile (name) {
		let prevTile =  this.currentTileNumber - 1;
		if (!this.getTileByName(name+prevTile)) {
			return null;
		}
		return this.getTileByName(name+prevTile);
	}

	/**
	 * Return the current tile of the animation
	 * @param  {string} name Animation name
	 * @return {tile}      	The current title
	 */
	currentAnimationTile (name) {
		if (!this.getTileByName(name+this.currentTileNumber)) {
			return null;
		}
		return this.getTileByName(name+this.currentTileNumber);
	}

	/**
	 * Play the animation
	 * @param  {string}  name      		Animation name
	 * @param  {int} 		x          		X value
	 * @param  {int} 		y          		Y value
	 * @param  {object} [scale={}] 		Scale object contain scale info for X and Y axis
	 * @param  {Boolean} [loop=false] Loop the animation or not
	 */
	play(name, x, y, scale, loop = false){
		if (this.currentAnimation != name) { // Check if the animation to play as change
			this.currentAnimation = name; // Set the new animation
			this.currentTileNumber = 1; // Reset the current tile
			this.totalFramePlayed = 1; // Reset the total frame
		}

		let tile = this.currentAnimationTile(name); // Get the current tile
		if(!(totalFramePlayed%this.animSpeed)) { 	// Change the displayed tile if totalFramePlayed is multiple to animSpeed
			tile = this.nextAnimationTile(name) // Get the new tile
			this.currentTileNumber++; // Increment the current tile number
		};

		if (!tile) { // If current tile is null
			if (loop) { // If we loop, reset the animation
				this.currentTileNumber = 1;
				tile = this.getTileByName(name+1); // Get the 1st tile of the animation
			} else { // If we don't loop
				tile = this.prevAnimationTile(name); // Return to the last tile
				this.currentTileNumber--; // Descrease the current tile number
			}
		}

		let offset = {
			x: (scale.x > 0)? this.getMaxTileW(name).width - tile.width : 0,
			y: (this.getMaxTile(name).height - tile.height)
		}

		// (this.getMaxTile(name).height - tile.height) is the tile's offset
		this.drawTile(tile, x, y, scale, offset);
		totalFramePlayed++;
	}
}
