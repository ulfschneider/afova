const { series, watch, src, dest } = require('gulp');
const minify = require('gulp-minify');


function testPreparation() {
    return src('./src/*.js')
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(dest('./test/public/js/'));
}

function buildPreparation() {
    return src('./src/*.js')
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(dest('./dist/'));
}

const watcher = () => {
    watch(['js/**/*'], testPreparation);
};

exports.default = series([testPreparation]);
exports.test = series([testPreparation]);
exports.build = series([buildPreparation])
exports.watch = watcher;