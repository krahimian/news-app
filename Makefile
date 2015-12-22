CPLATFORM=cordova platform
CPLUGIN=cordova plugin
IP=52.9.51.222

cordova:
	if [ ! -d './platforms/ios' ]; then $(CPLATFORM) add ios; fi
	if [ ! -d './platforms/android' ]; then $(CPLATFORM) add android; fi
	if [ ! -d './plugins/cordova-plugin-inappbrowser' ]; then $(CPLUGIN) add cordova-plugin-inappbrowser; fi
	if [ ! -d './plugins/cordova-plugin-statusbar' ]; then $(CPLUGIN) add cordova-plugin-statusbar; fi
	cordova prepare

npm:
	npm prune
	npm install -l

update:	npm cordova

deploy:
	grunt
	rsync -av --delete ./index.html deploy@$(IP):/home/deploy/app/index.html
	rsync -av --delete ./favicon.ico deploy@$(IP):/home/deploy/app/favicon.ico
	rsync -av --delete ./resources/icon.png deploy@$(IP):/home/deploy/app/icon.png


build_mobile: update
	grunt

build_ios: build_mobile
	cordova build ios

build_android: build_mobile
	cordova build --release android
	jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore android-release-key.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk alias_name
	if [ ! -a 'dist/android.apk' ]; then rm dist/android.apk; fi
	zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk dist/android.apk
