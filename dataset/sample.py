@bot.listen()
async def command_interaction(event: hikari.InteractionCreateEvent) -> None:
    components = [
        hikari.impl.TextDisplayComponentBuilder(content="If life gives you giant spaghetti, make giant spaghetti soup."),
        hikari.impl.ContainerComponentBuilder(accent_color=hikari.Color.from_hex_code("#0B8369"), spoiler=True).add_component(
            hikari.impl.TextDisplayComponentBuilder(content="Always hug a stranger before you explode."),
        ).add_component(
            hikari.impl.TextDisplayComponentBuilder(content="Behind every robot, there's a thrilled emotional potato."),
        ),
    ]

    await interaction.create_initial_response(
        hikari.ResponseType.MESSAGE_CREATE,
        components=components,
    )

    message = await interaction.fetch_initial_response()
