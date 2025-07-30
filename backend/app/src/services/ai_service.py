import logging

import google.genai as genai
from google.genai import types

# ロガーの設定
logger = logging.getLogger("app")


class AIService:
    """Google Gemini AIを使用した日記コメントサービス"""

    def __init__(
        self,
        client: genai.Client,
    ) -> None:
        self.client = client

    async def comment_on_diary(
        self,
        diary_content: str,
    ) -> str:
        """日記の内容に対してAIがコメントを生成する

        Args:
            diary_content (str): 日記の内容
            model (GeminiModel): 使用するAIモデル
        Returns:
            str: AIが生成したコメント
        """
        # 入力の検証
        if not diary_content or not isinstance(diary_content, str):
            raise ValueError("diary_contentは空でない文字列である必要があります")

        try:
            config = self._get_default_config()

            # 日記コメント用のプロンプトを作成
            prompt_content = self._create_diary_comment_prompt(
                diary_content=diary_content
            )

            _raw_response = await self.client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt_content,
                config=config,
            )
            raw_response = _raw_response.text

            assert isinstance(raw_response, str), "Response should be a string"
            logger.info(f"Diary comment generated successfully: {raw_response[:50]}")

        except Exception as e:
            logger.error(
                f"services/ai_service.py, Error during diary comment generation: {e}"
            )
            raise RuntimeError(f"日記コメントの生成に失敗しました: {str(e)}")

        return raw_response.strip()

    def _get_default_config(self) -> types.GenerateContentConfig:
        config = types.GenerateContentConfig(
            response_modalities=[
                types.Modality.TEXT,
            ],
            system_instruction=["あなたは優しくて思いやりのあるAIアシスタントです。"],
        )
        return config

    def _create_diary_comment_prompt(self, diary_content: str) -> str:
        """日記コメント用のプロンプトを生成する

        Args:
            diary_content (str): 日記の内容
        Returns:
            str: 生成されたプロンプト
        """

        prompt = f"""
あなたは優しくて思いやりのあるAIアシスタントです。
以下の日記の内容を読んで、感想やコメントを書いてください。

日記の内容:
{diary_content}

コメントを書く際の注意点:
- 日記を書いた人の気持ちに寄り添う
- 共感的で建設的なコメントにする
- 200文字程度の適度な長さにする
- 批判的にならず、ポジティブな視点を心がける
- 必要に応じて励ましや応援のメッセージを含める

コメント:
"""
        return prompt
