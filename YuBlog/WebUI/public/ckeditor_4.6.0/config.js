/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
    config.font_names = 'ËÎÌå/ËÎÌå;ºÚÌå/ºÚÌå;·ÂËÎ/·ÂËÎ_GB2312;¿¬Ìå/¿¬Ìå_GB2312;Á¥Êé/Á¥Êé;Ó×Ô²/Ó×Ô²;Î¢ÈíÑÅºÚ/Î¢ÈíÑÅºÚ;' + config.font_names;

    config.extraPlugins = 'uploadimage';
    config.imageUploadUrl = '/file/upload';
};
