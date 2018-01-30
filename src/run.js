let {promisify} = require('util')
let fs = require('fs')
let log = console.log
fs.readFileAsync = promisify( fs.readFile )
fs.writeFileAsync = promisify( fs.writeFile )

async function run() 
{
	try 
	{	
		let fn = process.argv[2]	

		log( `Converting to 1904 date format...` )
		log( `\tInput: ${fn}` )

		if ( !fn.match( /\.csv$/ ) )
			throw "Wrong Filetype. Expecting csv."

		let outfn = fn.replace( /\.csv$/, '.1904.csv' )

		let day_ms = 24*60*60*1000
		let offset = 1462 * day_ms // https://support.microsoft.com/en-us/help/214330/differences-between-the-1900-and-the-1904-date-system-in-excel

		let data = await fs.readFileAsync(fn, 'utf8')
		data = data.replace( /\d+\/\d+\/\d+/g, match => 
		{
			let d = new Date( match )
			d.setTime( d.getTime() - offset )
			return [ d.getMonth() + 1, d.getDate(), d.getFullYear() ].join('/')
		} )

		await fs.writeFileAsync( outfn, data )
		log( `\tOutput: ${outfn}\nDone.\n` )
	} 
	catch (err) 
	{ 
		console.log( `Error: ${err}\n\n!!!ERROR!!!\n` )
	} 
}

run()