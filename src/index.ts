import 'module-alias/register';
import loaderService from 'service/loaderService'
import checkService from 'service/checkService'

async function main() {
  try {
    checkService.envChecker()
    console.clear()

    loaderService.redisLoader()
    await loaderService.mongoLoader()
    await loaderService.routerLoader()
  } catch (e: any) {
    console.log('\x1b[31m%s\x1b[0m', `Fail to start server, ${e.message}`)
  }
}


main()
