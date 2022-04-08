const crypto = require('crypto')

const eventFetcher = (guild) => {
    const events = []
    Array.from(guild.scheduledEvents.cache.values()).forEach(event => {
        if (event.entityType == "EXTERNAL") events.push({
            name: getOrNone(event.name),
            description: getOrNone(event.description),
            location: getOrNone(event.entityMetadata.location),
            start: generateTimezoneString(event.scheduledStartAt),
            end: generateTimezoneString(event.scheduledEndAt),
            created: generateTimezoneString(event.createdAt),
            uid: crypto.randomUUID()
        })

    })
    return events
}

const generateTimezoneString = (date) => {
    return date.toISOString().replaceAll(":", "").replaceAll("-", "").split(".")[0] + "Z"
}

const getOrNone = (text) => {
    if (text) {
        return text
    } else {
        return ""
    }
}

exports.fetchEvents = eventFetcher