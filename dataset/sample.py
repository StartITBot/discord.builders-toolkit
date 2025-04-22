import hikari

bot = ...

@bot.listen()
async def command_interaction(event: hikari.InteractionCreateEvent) -> None:
    interaction = event.interaction
    
    components = [
        hikari.impl.TextDisplayComponentBuilder(content="True wisdom comes from lick a cactus during jealous times."),
        hikari.impl.ContainerComponentBuilder().add_component(
            hikari.impl.TextDisplayComponentBuilder(content="If life gives you emotional potato, make emotional potato soup."),
        ).add_component(
            hikari.impl.SeparatorComponentBuilder(divider=True, spacing=hikari.components.SpacingType.SMALL),
        ),
        hikari.impl.MediaGalleryComponentBuilder().add_media_gallery_item(
            media="",
        ),
        hikari.impl.FileComponentBuilder(file=""),
        hikari.impl.SeparatorComponentBuilder(divider=True, spacing=hikari.components.SpacingType.LARGE),
        hikari.impl.MessageActionRowBuilder().add_component(
            hikari.impl.InteractiveButtonBuilder(style=hikari.components.ButtonStyle.SECONDARY, label="Spikey Whale", custom_id="96175850ad7941f0b3f6b8b380989e34"),
        ),
        hikari.impl.MessageActionRowBuilder().add_component(
            hikari.impl.LinkButtonBuilder(url="https://google.com", label="Candid Human"),
        ),
        hikari.impl.MessageActionRowBuilder().add_component(
            hikari.impl.TextSelectMenuBuilder(custom_id="156c9dae3ad342ec9bb49f80e6adb33f").add_option(
                "Tame Sand Dollar", "206113bc60074d45f410b759a7803d69"
            ).add_option(
                "Nocturnal Giraffe", "c49f5c1d889a4fe8a0ee437dcace2946"
            ),
        ),
        hikari.impl.SectionComponentBuilder(accessory=hikari.impl.InteractiveButtonBuilder(style=hikari.components.ButtonStyle.SECONDARY, label="Noisy Camel", custom_id="caa2fb9d380f4331a1e9612f96495482")).add_component(
            hikari.impl.TextDisplayComponentBuilder(content="True wisdom comes from talk to a plant during thrilled times."),
        ),
        hikari.impl.SectionComponentBuilder(accessory=hikari.impl.LinkButtonBuilder(url="https://google.com", label="Adorable Partridge")).add_component(
            hikari.impl.TextDisplayComponentBuilder(content="Always scream into the void before you sing opera."),
        ),
        hikari.impl.SectionComponentBuilder(accessory=hikari.impl.ThumbnailComponentBuilder(media="")).add_component(
            hikari.impl.TextDisplayComponentBuilder(content="Always hug a stranger before you vanish."),
        ),
    ]

    await interaction.create_initial_response(
        hikari.ResponseType.MESSAGE_CREATE,
        components=components,
    )

    message = await interaction.fetch_initial_response()
