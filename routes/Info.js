require("dotenv").config();
const router = require("express").Router();
const diskusage = require("diskusage-ng");
const os = require("os-utils");
const AccountController = require("../controller/Account");
const ProfileController = require("../controller/Profile");
const GenreController = require("../controller/Genre");
const MovieController = require("../controller/Movie");

//MIDDLEWARE
const { protectedMiddleware } = require("./middleware");
router.use(protectedMiddleware);

router.get("/", (req, res) => {
    const account = req.account;
    if(!account.admin) throw "invalid account";
    
    //info
    let info = {};
    
    //system
    info.system = {};
    info.system.platform = os.platform();
    info.system.media_path = process.env.MEDIA_PATH;

    diskusage(process.env.MEDIA_PATH, (error, usage) => {
        if(!error) {
            info.system.disk = {
                total: usage.total,
                free: usage.available,
                used: usage.used,
                freePercentage: (usage.available * 100) / usage.total,
                usedPercentage: (usage.used * 100) / usage.total
            };
        }
        
        os.cpuUsage(async cpuUsedPercentage => {
            //cpu
            cpuUsedPercentage *= 100;
            info.system.cpu = {
                freePercentage: 100 - cpuUsedPercentage,
                usedPercentage: cpuUsedPercentage
            };

            //memory
            const
                totalmem = os.totalmem(),
                freemem = os.freemem(),
                usedmem = totalmem - freemem;

            info.system.memory = {
                total: totalmem,
                free: freemem,
                used: usedmem,
                freePercentage: (freemem * 100) / totalmem,
                usedPercentage: (usedmem * 100) / totalmem
            }

            //stats
            info.stats = {};
            info.stats.accounts = await AccountController.count();
            info.stats.profiles = await ProfileController.count();
            info.stats.genres = await GenreController.count();
            info.stats.movies = await MovieController.count();
            
            res.json(info);
        });
    });
});

module.exports = router;