from django.core.management.base import BaseCommand, CommandError
import xlparser.utils

import logging

LOGGER = logging.getLogger(__name__)


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('files', nargs='+', type=str)

    def handle(self, *args, **options):
        files = options['files']
        for f in files:
            LOGGER.info('starting parse %s',f)
            xlparser.utils.xl2text(f)
            LOGGER.info('end parse %s',f)

