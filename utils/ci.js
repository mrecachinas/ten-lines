// Listen on port 9001
var gith = require('gith').create( 9001 );
// Import execFile, to run our bash script
var execFile = require('child_process').execFile;

gith({
    repo: 'mrecachinas/ten-lines'
}).on( 'all', function( payload ) {
    console.log('hmm');
    if( payload.branch === 'master' ) {
        console.log('cool');
        execFile('./build.sh', function(error, stdout, stderr) {
            console.log( 'exec complete' );
        });
    }
});



