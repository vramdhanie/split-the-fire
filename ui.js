"use strict";
const React = require("react");
const { useEffect, useState } = require("react");
const { Text, Box, useInput, useApp } = require("ink");
const tablet = require("./tablet");
const fs = require("fs").promises;

const App = () => {
	const { exit } = useApp();
	const [verses, setVerses] = useState([]);
	const [split, setSplit] = useState([]);
	const [currentVerse, setCurrentVerse] = useState(0);

	const [input, setInput] = useState(":");
	const [validInput, setValidInput] = useState(true);

	useEffect(() => {
		setVerses(tablet);
	}, []);

	const saveFile = async (tablet) => {
		await fs.writeFile("verses.json", JSON.stringify(tablet, null, 2));
	};

	const splitVerse = (verse, sep) => {
		const i = verse.lastIndexOf(sep, verse.length - 2);
		const start = i > -1 ? verse.slice(0, i + 1) : verse;
		const end = i > -1 ? verse.slice(i + 1) : "";
		return { start, end };
	};

	useInput((char, key) => {
		if (key.return) {
			if (validInput) {
				if (input === "q") {
					saveFile(split);
					return exit();
				}
				setSplit([...split, splitVerse(verses[currentVerse], input)]);
				setCurrentVerse(currentVerse + 1);
			}
		} else {
			const valid = [".", ",", ":", "!", "q"].includes(char);
			setValidInput(valid);
			setInput(char);
		}
	});

	return (
		<Box flexDirection="column" marginTop={2} width={80}>
			<Box justifyContent="center">
				<Text color="blueBright">Verse {currentVerse}</Text>
			</Box>
			<Box padding={1} borderStyle="double">
				<Text color="green">{verses.length && verses[currentVerse]}</Text>
			</Box>
			<Box marginBottom={1}>
				<Text color="blue">
					Select the character to split this verse (. or , or : [q to quit]):
				</Text>
				<Text color={validInput ? "yellow" : "red"}>{input}</Text>
			</Box>
		</Box>
	);
};

module.exports = App;
