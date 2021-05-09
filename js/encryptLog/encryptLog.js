const fs = require('fs');
const crypto = require('crypto');
const encrypt = () => {
    try {
        if (fileObject.logFile !== null && fileObject.secretKey !== null) {
            const logFileName = fileObject.logFile.name;
            const secretKeyName = fileObject.secretKey.name;

            const logFile = fs.readFileSync('./logs/' + logFileName, 'utf-8');
            const secretKey = fs.readFileSync('./keys/' + secretKeyName, 'utf-8');
            
            const signer = crypto.createSign('RSA-SHA256');
            signer.write(logFile);
            signer.end();

            const signature = signer.sign(secretKey, 'base64');
            fs.writeFileSync(`./signature/signature(${logFileName}).txt`, signature);
            alert(`Successfully! Your signature is in the local folder 'signature', file name: signature(${logFileName}).txt`);
        } else {
            throw new Error("The user did not specify the required set of files");
        }
    } catch (e) {
        errorHandler(fs, e);
    }
}
const decrypt = () => {
    try {
        if (fileObject.checkLog !== null && fileObject.publicKey !== null) {
            const checkLogFileName = fileObject.checkLog.name;
            const publicKeyFileName = fileObject.publicKey.name;
            const signatureFileName = fileObject.signature.name;
            
            const checkLogFile = fs.readFileSync('./logs/' + checkLogFileName, 'utf-8');
            const publicKeyFile = fs.readFileSync('./keys/' + publicKeyFileName, 'utf-8');
            const signatureFile = fs.readFileSync('./signature/' + signatureFileName, 'utf-8');

            const verifier = crypto.createVerify('RSA-SHA256');
            verifier.write(checkLogFile);
            verifier.end();

            const result = verifier.verify(publicKeyFile, signatureFile, 'base64');

            result ? alert('Luck! The file is true') : alert('Oops.. The file is false');
            
        } else {
            throw new Error("The user did not specify the required set of files");
        }
    } catch (e) {
        errorHandler(fs, e);
    }
}